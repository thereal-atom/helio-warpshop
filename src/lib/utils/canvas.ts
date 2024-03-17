import { createCanvas, loadImage } from "@napi-rs/canvas";

const PRIMARY_COLOR = "#191919";
const SECONDARY_COLOR = "#2A2A2B";

const TEXT_COLOR = "#E17231";
const SECONDARY_TEXT_COLOR = "#B0B2C0";
const FONT = "bold 36px Inter";

export const generateBaseFrameCanvas = () => {
    const canvasWidth = 955;
    const canvasHeight = 500;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = PRIMARY_COLOR;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    return {
        canvas,
        ctx,
        canvasWidth,
        canvasHeight,
    };
};

export const generatePaylinkProductCanvas = async (data: {
    thumbnailUrl?: string;
    productName: string;
    price: {
        amount: number;
        currency: string;
    };
}) => {
    const {
        canvas,
        ctx,
        canvasWidth,
        canvasHeight,
    } = generateBaseFrameCanvas();

    const gradientBackgroundWidth = 700;
    const gradientBackgroundHeight = 400;
    const gradientBackgroundX = canvasWidth / 2 - gradientBackgroundWidth / 2;
    const gradientBackgroundY = 15;
    
    const gradient = ctx.createLinearGradient(0, 0, gradientBackgroundWidth, gradientBackgroundHeight);

    gradient.addColorStop(0.0, "#ED8A6F");
    gradient.addColorStop(0.5, "#9A748C");
    gradient.addColorStop(1, "#7F7066");

    ctx.fillStyle = gradient;
    ctx.fillRect(gradientBackgroundX, gradientBackgroundY, gradientBackgroundWidth, gradientBackgroundHeight);

    if (data.thumbnailUrl) {
        const maxThumbnailHeight = gradientBackgroundHeight * 0.9;

        const thumbnailImage = await loadImage(data.thumbnailUrl);
    
        const thumbnailImageRatio = thumbnailImage.width / thumbnailImage.height;
        const thumbnailImageWidth = maxThumbnailHeight * thumbnailImageRatio;
        const thumbnailImageHeight = maxThumbnailHeight;
    
        ctx.drawImage(thumbnailImage, canvasWidth / 2 - thumbnailImageWidth / 2, gradientBackgroundY + gradientBackgroundHeight / 2 - thumbnailImageHeight / 2, thumbnailImageHeight, thumbnailImageWidth);
    } else {
        ctx.font = FONT;
        ctx.fillStyle = "#FFFFFF";

        ctx.fillText("No Thumbnail Found", gradientBackgroundX + 135, gradientBackgroundY + gradientBackgroundHeight / 2 + 10);
    };

    const topTextPadding = 50;

    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.fillText(data.productName, gradientBackgroundX, gradientBackgroundY + gradientBackgroundHeight + topTextPadding, gradientBackgroundWidth / 2 - 25);
    ctx.fillText(`Price: ${data.price.amount} ${data.price.currency}`, gradientBackgroundX + gradientBackgroundWidth / 2, gradientBackgroundY + gradientBackgroundHeight + topTextPadding, gradientBackgroundWidth / 2);

    return canvas;
};

export const generatePaylinkDescriptionCanvas = async (data: {
    productName: string;
    description: string;
    price: {
        amount: number;
        currency: string;
    };
}) => {
    const {
        canvas,
        ctx,
        canvasWidth,
        canvasHeight,
    } = generateBaseFrameCanvas();

    const backgroundWidth = 700;
    const backgroundHeight = 400;
    const backgroundX = canvasWidth / 2 - backgroundWidth / 2;
    const backgroundY = 15;

    ctx.fillStyle = SECONDARY_COLOR;
    ctx.fillRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight);

    ctx.font = FONT;

    const leftTextPadding = 30;
    const topTextPadding = 60;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(data.productName, backgroundX + leftTextPadding, backgroundY + topTextPadding, backgroundWidth - leftTextPadding - 20);

    ctx.fillStyle = SECONDARY_TEXT_COLOR;
    ctx.fillText(data.description, backgroundX + leftTextPadding, backgroundY + topTextPadding + 100, backgroundWidth - leftTextPadding - 20);

    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.fillText(data.productName, backgroundX, backgroundY + backgroundHeight + topTextPadding, backgroundWidth / 2 - 25);
    ctx.fillText(`Price: ${data.price.amount} ${data.price.currency}`, backgroundX + backgroundWidth / 2, backgroundY + backgroundHeight + topTextPadding, backgroundWidth / 2);

    return canvas;
};

export const generatePaylinkCurrencyCanvas = async (data: {
    prices: {
        amount: number;
        symbol: string;
    }[]
}) => {
    const {
        canvas,
        ctx,
    } = generateBaseFrameCanvas();

    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;

    const minimum = 75;
    const distance = 75;

    data.prices.forEach((price, i) => {
        ctx.fillText(`${price.amount} ${price.symbol}`, 60, minimum + i * distance);
    });

    return canvas;
};