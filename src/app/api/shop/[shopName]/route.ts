import { NextRequest } from "next/server";
import { shops } from "../../data";

interface Props {
    params: {
        shopName: string;
    };
};

export async function GET(
    request: NextRequest,
    { params }: Props,
) {
    const shop = shops.find(shop => shop.name === params.shopName);
   
    return Response.json(shop);
};