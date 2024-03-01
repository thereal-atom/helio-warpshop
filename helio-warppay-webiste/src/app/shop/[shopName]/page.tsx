import { Metadata } from "next";

type Props = {
    params: {
        shopName: string;
    };
};

export async function generateMetadata ({ params }: Props): Promise<Metadata> {
    // fetch shop details like
    // const shopData = await getShop(params.shopName)
    // generate farcaster meta tags like
    // "fc:frame:image": shopData.imageUrl
    // "fc:frame:button:1": "xyz"
    // "fc:frame:button:1:action": "abc"
    // "fc:frame:button:1:target": shopData.products[0].paymentUrl
    // ... etc

    const shopData: any = await new Promise((resolve) => {
        const shops = [
            {
                name: "hoodies",
                description: "Shop that sells hoodies",
                imageUrl: "https://d3v0px0pttie1i.cloudfront.net/uploads/user/logo/19066776/twitter_ba238b31.png",
                products: [
                    {
                        name: "Product 1",
                        description: "Product 1's description.",
                        price: 420,
                        paymentLink: "",
                    },
                ],
            },
        ];

        const shop = shops.find(shop => shop.name === params.shopName);

        resolve(shop);
    });

    return {
        title: `Helio Warpshop | ${shopData.name}`,
        other: {
            "fc:frame": "vNext",
            "fc:frame:image": shopData.imageUrl,
            "og:title": `Helio Warpshop | ${shopData.name}`,
            "og:image": shopData.imageUrl,
        },
    };
};

export default function Shop({ params }: Props) {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <h1 className="text-3xl font-bold">Store: {params.shopName}</h1>
            <p>Details about store.</p>
        </div>
    )
};