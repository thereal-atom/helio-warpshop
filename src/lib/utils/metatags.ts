import { Metadata } from "next";
import { generateErrorCanvas } from "./canvas";
import { generateFarcasterMetatags } from "./farcaster";

// dodgy naming??
export const generateMetatagsHTMLComponentString = (metadata: Metadata) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                ${
                    Object
                        .entries(metadata)
                        .map(([
                            key,
                            value,
                        ]) => {
                            return `<meta property="${key}" content="${value}" />`
                        })
                        .join("\n")
                }
            </head>
        </html>
    `;
};

export const generateErrorMetadata = (errorMessage: string) => {
    const canvas =  generateErrorCanvas({ errorMessage });

    const canvasImageUrl = canvas.toDataURL();

    const farcasterMetadata = generateFarcasterMetatags({ imageUrl: canvasImageUrl });

    const title = `Helio | Error`;

    const metadata = {
        "title": title,
        "og:title": title,
        "og:image": canvasImageUrl,
        ...farcasterMetadata,
    };

    return metadata;
};