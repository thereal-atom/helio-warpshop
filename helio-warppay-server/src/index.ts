const createPaymentLink = (data: {
    name: string;
    description?: string;
    pricingCurrency: string;
    currency: string;
    recipients: {
        currencyId: string;
        walletId: string;
    }[]
    price: number;
    features?: {};
}) => {};