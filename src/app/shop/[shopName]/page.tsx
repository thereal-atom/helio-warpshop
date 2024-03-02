import { Metadata } from "next";

type Props = {
    params: {
        shopName: string;
    };
};

type Shop = {
    name: string;
    description: string;
    imageUrl?: string;
    products: {
        name: string;
        description: string;
        price: number;
        paymentLink: string;
    }[];
};

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
    const shopData: Shop = await new Promise((resolve, reject) => {
        const shops: Shop[] = [
            {
                name: "hoodies",
                description: "Shop that sells hoodies",
                imageUrl: "https://d3v0px0pttie1i.cloudfront.net/uploads/user/logo/19066776/twitter_ba238b31.png",
                products: [
                    {
                        name: "Product 1",
                        description: "Product 1's description.",
                        price: 21,
                        paymentLink: "https://app.hel.io/pay/65df262ccdb9f548d11a6687",
                    },
                    {
                        name: "Product 2",
                        description: "Product 2's description.",
                        price: 69,
                        paymentLink: "https://app.hel.io/pay/65df26e6d71118776ad59877",
                    },
                    {
                        name: "Product 3",
                        description: "Product 3's description.",
                        price: 420,
                        paymentLink: "https://app.hel.io/pay/65df274ccdb9f548d11a7033",
                    },
                ],
            },
        ];

        const shop = shops.find(shop => shop.name === params.shopName);

        if (!shop) {
            return reject("Shop not found.");
        };

        resolve(shop);
    });

    const farcasterButtons: Record<`fc:frame:button:${number}${"" | ":action" | ":target"}`, string>[] = shopData.products.map((product, i) => {
        return {
            [`fc:frame:button:${i + 1}`]: `${product.name} - $${product.price}`,
            [`fc:frame:button:${i + 1}:action`]: "link",
            [`fc:frame:button:${i + 1}:target`]: product.paymentLink,
        };
    });

    const metadata = {
        "title": `Helio Warpshop | ${shopData.name}`,
        "og:title": `Helio Warpshop | ${shopData.name}`,
        "og:image": shopData.imageUrl || "",
        "other": {
            "fc:frame": "vNext",
            "fc:frame:image": shopData.imageUrl || "",
            ...farcasterButtons.reduce((r, c) => Object.assign(r, c), {}),
        },
    };

    return metadata;
};

export default function Shop({ params }: Props) {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <h1 className="text-3xl font-bold">Store: {params.shopName}</h1>
            <p>Details about store.</p>
        </div>
    )
};