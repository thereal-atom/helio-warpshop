import { z } from "zod";
import { Metadata } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Canvas } from "@napi-rs/canvas";
import { generateFarcasterMetatags } from "@/lib/utils/farcaster";
import { generatePaylinkCurrencyCanvas, generatePaylinkDescriptionCanvas, generatePaylinkProductCanvas } from "@/lib/utils/canvas";
import { generatePaylinkUrl, getExchangeRate, getPaylinkData } from "@/lib/utils/helio";

interface Props {
    params: {
        paylinkId: string;
    };
};

const paylinkFrameTypeSchema = z.union([
    z.literal("product"),
    z.literal("description"),
    z.literal("currency"),
]);

// dodgy naming??
const generateMetatagsHTMLComponentString = (metadata: Metadata) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                ${
                    Object
                        .entries(metadata)
                        .map(([
                            key,
                            value,
                        ]) => {
                            return `<meta property="${key}" content="${value}" />`
                        })
                        .join("\n")
                }
            </head>
        </html>
    `;
};

const generatePaylinkFrameMetadata = async (paylinkId: string, requestUrl: string, paylinkFrameType: z.infer<typeof paylinkFrameTypeSchema>): Promise<Metadata> => {
    const res = await getPaylinkData(paylinkId);

    if (!res.success) {
        return {
            // TODO: error metatags
        };
    };

    const paylink = res.data;

    // TODO: type properly
    const prices: any[] = await Promise.all(paylink.recipients.map(currency => {
        return new Promise(async (resolve) => {
            const res = await getExchangeRate(paylink.pricingCurrency.symbol, currency.currency.symbol, parseInt(paylink.price) / Math.pow(10, paylink.pricingCurrency.decimals));

            if (!res.success) {
                // TODO: handle error
                return {};
            };

            resolve({
                amount: parseFloat(res.data.amount),
                symbol: currency.currency.symbol,
            });
        });
    }));

    let canvas: Canvas;

    switch (paylinkFrameType) {
        case "product":
            canvas = await generatePaylinkProductCanvas({
                productName: paylink.name,
                price: {
                    amount: parseInt(paylink.price) / Math.pow(10, paylink.pricingCurrency.decimals),
                    currency: paylink.pricingCurrency.symbol, 
                },
                thumbnailUrl: paylink.imageUrl,
            });

            break;
        case "description":
            canvas = await generatePaylinkDescriptionCanvas({
                productName: paylink.name,
                description: paylink.description,
                price: {
                    amount: parseInt(paylink.price) / Math.pow(10, paylink.pricingCurrency.decimals),
                    currency: paylink.pricingCurrency.symbol, 
                },
            });

            break;
        case "currency":
            canvas = await generatePaylinkCurrencyCanvas({ prices });

            break;
        default:
            canvas = await generatePaylinkProductCanvas({
                productName: paylink.name,
                price: {
                    amount: parseInt(paylink.price) / Math.pow(10, paylink.pricingCurrency.decimals),
                    currency: paylink.pricingCurrency.symbol, 
                },
                thumbnailUrl: paylink.imageUrl,
            });

            break;
    };

    const canvasImageUrl = canvas.toDataURL();

    // TODO: remove NGROK part
    const basePostUrl = requestUrl.replace("https://localhost:3000", "https://4daf-86-169-70-176.ngrok-free.app");

    const farcasterMetadata = generateFarcasterMetatags({
        imageUrl: canvasImageUrl,
        buttons: [
            {
                index: 1,
                label: "Product",
                action: "post",
                target: `${basePostUrl}?paylinkFrameType=product`,
            },
            {
                index: 2,
                label: "Description",
                action: "post",
                target: `${basePostUrl}?paylinkFrameType=description`,
            },
            {
                index: 3,
                label: "Currency",
                action: "post",
                target: `${basePostUrl}?paylinkFrameType=currency`,
            },
            {
                index: 4,
                label: "Purchase",
                action: "link",
                target: generatePaylinkUrl(paylinkId),
            },
        ],
    });

    const title = `Helio | ${paylink.name}`;

    const metadata = {
        "title": title,
        "og:title": title,
        "og:image": canvasImageUrl,
        ...farcasterMetadata,
    };

    return metadata;
};

export const GET = async (
    request: NextRequest,
    { params }: Props,
) => {
    const metadata = await generatePaylinkFrameMetadata(params.paylinkId, `${request.nextUrl.origin}${request.nextUrl.pathname}`, "product");

    return new NextResponse(
        generateMetatagsHTMLComponentString(metadata) + `<body><a href=${generatePaylinkUrl(params.paylinkId)}>Redirect To Paylink</a></body>`,
        { headers: { 'content-type': "text/html" } },
    );
};

export const POST = async (
    request: NextRequest,
    { params }: Props,
) => {
    const paylinkFrameType = paylinkFrameTypeSchema.parse(new URL(request.url).searchParams.get("paylinkFrameType"));

    const metadata = await generatePaylinkFrameMetadata(params.paylinkId, `${request.nextUrl.origin}${request.nextUrl.pathname}`, paylinkFrameType);

    return new NextResponse(generateMetatagsHTMLComponentString(metadata));
};