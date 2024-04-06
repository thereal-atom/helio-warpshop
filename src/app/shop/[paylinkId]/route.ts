import { Metadata } from "next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Canvas } from "canvas";
import { generateFarcasterMetatags } from "@/lib/utils/farcaster";
import { generatePaylinkCurrencyCanvas, generatePaylinkDescriptionCanvas, generatePaylinkProductCanvas } from "@/lib/utils/canvas";
import { generatePaylinkUrl, getExchangeRate, getPaylinkData } from "@/lib/utils/helio";
import { generateErrorMetadata, generateMetatagsHTMLComponentString } from "@/lib/utils/metatags";

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

const generatePaylinkFrameMetadata = async (paylinkId: string, requestUrl: string, paylinkFrameType: z.infer<typeof paylinkFrameTypeSchema>, priceIndex: number): Promise<Metadata> => {
    const res = await getPaylinkData(paylinkId);

    if (!res.success) {
        return generateErrorMetadata(res.error.message);
    };

    const paylink = res.data;

    // TODO: type properly
    const prices: any[] = await Promise.all(paylink.recipients.map(currency => {
        return new Promise(async (resolve) => {
            const res = await getExchangeRate(paylink.pricingCurrency.symbol, currency.currency.symbol, parseInt(paylink.price) / Math.pow(10, paylink.pricingCurrency.decimals));

            if (!res.success) {
                return generateErrorMetadata(res.error.message);
            };

            resolve({
                amount: parseFloat(res.data.amount),
                symbol: currency.currency.symbol,
            });
        });
    }));

    const nextPriceIndex = priceIndex < (prices.length -1) ? priceIndex + 1 : 0;

    let canvas: Canvas;

    switch (paylinkFrameType) {
        case "product":
            canvas = await generatePaylinkProductCanvas({
                productName: paylink.name,
                productDescription: paylink.description,
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
            canvas = await generatePaylinkProductCanvas({
                productName: paylink.name,
                productDescription: paylink.description,
                price: {
                    amount: prices[priceIndex].amount,
                    currency: prices[priceIndex].symbol,
                },
                thumbnailUrl: paylink.imageUrl,
            });

            break;
        default:
            canvas = await generatePaylinkProductCanvas({
                productName: paylink.name,
                productDescription: paylink.description,
                price: {
                    amount: parseInt(paylink.price) / Math.pow(10, paylink.pricingCurrency.decimals),
                    currency: paylink.pricingCurrency.symbol, 
                },
                thumbnailUrl: paylink.imageUrl,
            });

            break;
    };

    const canvasImageUrl = canvas.toDataURL();

    const basePostUrl = requestUrl;

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
                label: `${prices[nextPriceIndex].symbol} Price`,
                action: "post",
                target: `${basePostUrl}?paylinkFrameType=currency&priceIndex=${nextPriceIndex}`,
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
    const host = `${request.headers.get("x-forwarded-proto")}://${request.headers.get("host")}`;

    const metadata = await generatePaylinkFrameMetadata(params.paylinkId, `${host}${request.nextUrl.pathname}`, "product", 1);

    return new NextResponse(
        generateMetatagsHTMLComponentString(metadata) + `<body><a href=${generatePaylinkUrl(params.paylinkId)}>Redirect To Paylink</a></body>`,
        { headers: { 'content-type': "text/html" } },
    );
};

export const POST = async (
    request: NextRequest,
    { params }: Props,
) => {
    const host = `${request.headers.get("x-forwarded-proto")}://${request.headers.get("host")}`;

    const searchParams = new URL(request.url).searchParams;

    const paylinkFrameType = paylinkFrameTypeSchema.parse(searchParams.get("paylinkFrameType"));
    const priceIndex = searchParams.get("priceIndex");

    const metadata = await generatePaylinkFrameMetadata(params.paylinkId, `${host}${request.nextUrl.pathname}`, paylinkFrameType, paylinkFrameType === "product" ? 1 : parseInt(priceIndex?.toString() || "0"));

    return new NextResponse(generateMetatagsHTMLComponentString(metadata));
};