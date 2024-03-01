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

        resolve(shop);
    });

    return {
        title: `Helio Warpshop | ${shopData.name}`,
        other: {
            "fc:frame": "vNext",
            "fc:frame:image": shopData.imageUrl,

            "fc:frame:button:1": "Product 1",
            "fc:frame:button:1:action": "link",
            "fc:frame:button:1:target": "https://app.hel.io/pay/65df262ccdb9f548d11a6687",
            
            "fc:frame:button:2": "Product 2",
            "fc:frame:button:2:action": "link",
            "fc:frame:button:2:target": "https://app.hel.io/pay/65df26e6d71118776ad59877",
            
            "fc:frame:button:3": "Product 3",
            "fc:frame:button:3:action": "link",
            "fc:frame:button:3:target": "https://app.hel.io/pay/65df274ccdb9f548d11a7033",

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