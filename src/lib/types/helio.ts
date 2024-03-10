interface HelioPaylink {
    id: string;
    description: string;
    name: string;
    price: string;
    pricingCurrency: {
        symbol: string;
        decimals: number;
    };
    imageUrl?: string;
    recipients: {
        currency: {
            name: string;
            decimals: string;
            symbol: string;
        };
    }[];
};