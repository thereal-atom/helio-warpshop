export type Shop = {
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