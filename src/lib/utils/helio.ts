import { CustomRequestResult } from "../types/api";

export const getPaylinkData = async (id: string): Promise<CustomRequestResult<HelioPaylink>> => {
    const res = await fetch(`https://api.hel.io/v1/paylink/${id}/public`);

    if (!res.ok) {
        const text = await res.text();

        return {
            success: false,
            error: {
                message: text || "An unknown error has occurred.",
            },
        };
    };

    const paylink: HelioPaylink = await res.json();

    return {
        success: true,
        data: paylink,
    };
};

// from will be the pricing currency
// to will be from the array of recipient currencies

export const getExchangeRate = async (from: string, to: string, amount: number): Promise<CustomRequestResult<{
    amount: string
}>> => {
    const res = await fetch(`https://api.hel.io/v1/exchange-rates/public-fiat?from=${from}&to=${to}&amount=${amount}`);

    if (!res.ok) {
        const text = await res.text();

        return {
            success: false,
            error: {
                message: text || "An unknown error has occurred.",
            },
        };
    };

    const rate = await res.json();

    return {
        success: true,
        data: rate,
    };
};

export const generatePaylinkUrl = (id: string): string => `https://app.hel.io/pay/${id}`;