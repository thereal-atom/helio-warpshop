import { Shop } from "@/lib/types";

export const shops: Shop[] = [
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