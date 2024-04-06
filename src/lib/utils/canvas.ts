import { createCanvas, loadImage } from "canvas";

const PRIMARY_COLOR = "#2A2A2B";

const TEXT_COLOR = "#E17231";
const FONT = "bold 36px Inter";

const API_URL = "https://097d-109-152-240-138.ngrok-free.app";

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
    productDescription: string;
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

    const leftMargin = 30;

    const verifiedText = "Verified";
    const verifiedHeight = 24;
    const verifiedTextSize = 16;

    const imageContainerHeight = canvasHeight * 0.9;
    const imageContainerWidth = imageContainerHeight;
    const imageContainerY = (canvasHeight - imageContainerHeight) / 2;
    const imageContainerX = imageContainerY;

    const titleText = data.productName;
    const titleTextHeight = ctx.measureText(titleText).actualBoundingBoxAscent;
    const titleTextTopPadding = 12;
    const titleTextSize = 40;

    const descriptionText = data.productDescription;
    const descriptionTextTopPadding = 20;
    const descriptionTextSize = 18;
    const descriptionTextMaxWidth = 400;

    ctx.font = `${descriptionTextSize}px Inter`;
    ctx.fillStyle = "#B0B2C0";

    let lines: string[] = [];
    let currentLine = "";

    descriptionText
        .split("")
        .forEach((char, i) => {
            const width = ctx.measureText(currentLine).width;

            if (width > descriptionTextMaxWidth || char === "\n" || i === descriptionText.length - 1) {
                lines.push(currentLine);
                currentLine = "";
            } else {
                currentLine += char;
            };
        });

    lines = lines.slice(0, 8);

    const descriptionTextHeight = lines.length * descriptionTextSize;

    const socialMediaText = "X Profile";
    const socialMediaHeight = 24;
    const socialMediaTopPadding = 6;
    const socialMediaTextSize = 16;

    const totalPriceText = "Total Price: ";
    const priceAmountText = `${data.price.amount} ${data.price.currency}`;
    const totalPriceContainerHeight = 56;
    const totalPriceContainerTopPadding = 20;
    const priceTextSize = 16;

    const poweredByHelioText = "Powered by Helio";
    const poweredByHelioTextHeight = ctx.measureText(poweredByHelioText).actualBoundingBoxAscent;
    const poweredByHelioTextTopPadding = 30;
    const poweredByHelioTextSize = 16;

    const totalContentHeight =
        verifiedHeight
        + titleTextHeight + titleTextTopPadding
        + descriptionTextHeight + descriptionTextTopPadding
        + socialMediaHeight + socialMediaTopPadding
        + totalPriceContainerTopPadding + totalPriceContainerHeight
        + poweredByHelioTextHeight + poweredByHelioTextTopPadding;
    const contentTopPadding = (imageContainerHeight - totalContentHeight) / 2;

    // verified badge ======= 

    const verifiedBadgeImage = await loadImage(`${API_URL}/verified-badge.png`);

    const verifiedY = contentTopPadding;

    ctx.drawImage(verifiedBadgeImage, imageContainerX + imageContainerWidth + leftMargin, verifiedY);

    ctx.font = `${verifiedTextSize}px Inter`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(verifiedText, imageContainerX + imageContainerWidth + leftMargin + verifiedBadgeImage.width - verifiedTextSize + 16, verifiedY + verifiedHeight - 4);

    // image ==============================================================================================================================================================================================================================

    if (data.thumbnailUrl) {
        const thumbnailImage = await loadImage(data.thumbnailUrl);

        const thumbnailImageRatio = thumbnailImage.width / thumbnailImage.height;
    
        const isFillingWidth = thumbnailImageRatio > 1;
        const isFillingHeight = thumbnailImageRatio < 1;

        const thumbnailImageWidth = isFillingWidth ? imageContainerWidth : imageContainerHeight * thumbnailImageRatio;
        const thumbnailImageHeight = isFillingHeight ? imageContainerHeight : imageContainerWidth / thumbnailImageRatio;
        const thumbnailImageX = isFillingWidth ? imageContainerX : imageContainerX + (imageContainerWidth - thumbnailImageWidth) / 2;
        const thumbnailImageY = isFillingHeight ? imageContainerY : imageContainerY + (imageContainerHeight - thumbnailImageHeight) / 2;

        ctx.drawImage(thumbnailImage, thumbnailImageX, thumbnailImageY, thumbnailImageWidth, thumbnailImageHeight);
    } else {
        ctx.beginPath();
        ctx.fillStyle = "#3A3B3C";
        ctx.roundRect(imageContainerX, imageContainerY, imageContainerWidth, imageContainerHeight, 12);
        ctx.fill();
        
        const thumbnailImage = await loadImage(`${API_URL}/default-thumbnail-image.png`);

        const thumbnailImageX = imageContainerX + (imageContainerWidth - thumbnailImage.width) / 2;
        const thumbnailImageY = imageContainerY + (imageContainerHeight - thumbnailImage.height) / 2;

        ctx.drawImage(thumbnailImage, thumbnailImageX, thumbnailImageY);
    };

    // title ==============================================================================================================================================================================================================================
    
    const titleTextY = verifiedY + verifiedHeight + titleTextSize + titleTextTopPadding;

    ctx.font = `bold ${titleTextSize}px Inter`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(titleText, imageContainerX + imageContainerWidth + leftMargin, titleTextY);

    // description ====================================================================================================================================================================================================================================

    const descriptionTextY = titleTextY + descriptionTextSize + descriptionTextTopPadding;

    ctx.font = `${descriptionTextSize}px Inter`;
    ctx.fillStyle = "#B0B2C0";

    lines.forEach((line, index) => {
        ctx.fillText(line, imageContainerX + imageContainerWidth + leftMargin, descriptionTextY + descriptionTextSize * index);
    });

    // description ====================================================================================================================================================================================================================================

    const socialMediaY = descriptionTextY + descriptionTextHeight + socialMediaTopPadding;

    const socialMediaImage = await loadImage("https://097d-109-152-240-138.ngrok-free.app/x-icon.png");

    ctx.drawImage(socialMediaImage, imageContainerX + imageContainerWidth + leftMargin, socialMediaY);

    ctx.font = `${socialMediaTextSize}px Inter`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(socialMediaText, imageContainerX + imageContainerWidth + leftMargin + socialMediaImage.width + 12, socialMediaY + (socialMediaHeight - socialMediaTextSize) / 2 + socialMediaTextSize - 2);

    // total price ====================================================================================================================================================================================================================================

    const totalPriceContainerX = imageContainerX + imageContainerWidth + leftMargin;
    const totalPriceContainerY = socialMediaY + socialMediaHeight + totalPriceContainerTopPadding;

    const totalPriceContainerPaddingX = 16;
    
    ctx.font = `${priceTextSize}px Inter`;
    const totalPriceTextWidth = ctx.measureText(totalPriceText).width;
    ctx.font = `bold ${priceTextSize}px Inter`;
    const priceAmountTextWidth = ctx.measureText(priceAmountText).width;

    const totalPriceContainerWidth = (totalPriceTextWidth + priceAmountTextWidth) + totalPriceContainerPaddingX * 2;

    ctx.beginPath();
    ctx.fillStyle = "#3A3B3C";
    ctx.roundRect(totalPriceContainerX, totalPriceContainerY, totalPriceContainerWidth, totalPriceContainerHeight, 8);
    ctx.fill();

    ctx.font = `${priceTextSize}px Inter`;
    ctx.fillStyle = "#FFFFFF";

    const priceTextHeight = ctx.measureText(totalPriceText).actualBoundingBoxAscent;
    const priceTextTopPadding = (totalPriceContainerHeight - priceTextHeight) / 2 - 3;

    ctx.fillText(totalPriceText, totalPriceContainerX + totalPriceContainerPaddingX, totalPriceContainerY + priceTextSize + priceTextTopPadding);
    ctx.font = `bold ${priceTextSize}px Inter`;
    ctx.fillText(priceAmountText, totalPriceContainerX + totalPriceContainerPaddingX + totalPriceTextWidth, totalPriceContainerY + priceTextSize + priceTextTopPadding);

    // powered by helio text ====================================================================================================================================================================================================================================

    const poweredByHelioTextY = totalPriceContainerY + totalPriceContainerHeight + poweredByHelioTextTopPadding;

    ctx.font = `${poweredByHelioTextSize}px Inter`;
    ctx.fillStyle = "#A9B3C4";
    ctx.fillText("Powered by helio", totalPriceContainerX, poweredByHelioTextY);

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

    const leftMargin = 30;

    const verifiedText = "Verified";
    const verifiedHeight = 24;
    const verifiedTextSize = 16;

    const titleText = data.productName;
    const titleTextTopPadding = 12;
    const titleTextSize = 40;

    const descriptionText = data.description;
    const descriptionTextTopPadding = 20;
    const descriptionTextSize = 18;
    const descriptionTextMaxWidth = 900;

    ctx.font = `${descriptionTextSize}px Inter`;
    ctx.fillStyle = "#B0B2C0";

    let lines: string[] = [];
    let currentLine = "";

    descriptionText
        .split("")
        .forEach((char, i) => {
            const width = ctx.measureText(currentLine).width;

            if (width > descriptionTextMaxWidth || char === "\n" || i === descriptionText.length - 1) {
                lines.push(currentLine);
                currentLine = "";
            } else {
                currentLine += char;
            };
        });

    lines = lines.slice(0, 25);

    // verified badge

    const verifiedBadgeImage = await loadImage("https://097d-109-152-240-138.ngrok-free.app/verified-badge.png");

    const verifiedY = 20;

    ctx.drawImage(verifiedBadgeImage, leftMargin, verifiedY);

    ctx.font = `${verifiedTextSize}px Inter`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(verifiedText, leftMargin + verifiedBadgeImage.width - verifiedTextSize + 16, verifiedY + verifiedHeight - 4);

    // title

    const titleTextY = verifiedY + verifiedHeight + titleTextSize + titleTextTopPadding;

    ctx.font = `bold ${titleTextSize}px Inter`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(titleText, leftMargin, titleTextY);

    // description

    const descriptionTextY = titleTextY + descriptionTextSize + descriptionTextTopPadding;

    ctx.font = `${descriptionTextSize}px Inter`;
    ctx.fillStyle = "#B0B2C0";

    lines.forEach((line, index) => {
        ctx.fillText(line, leftMargin, descriptionTextY + descriptionTextSize * index);
    });

    return canvas;
};

export const generatePaylinkCurrencyCanvas = async (data: {
    price: {
        amount: number;
        symbol: string;
    };
}) => {
    const {
        canvas,
        ctx,
    } = generateBaseFrameCanvas();

    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;

    const minimum = 75;

    ctx.fillText(`${data.price.amount} ${data.price.symbol}`, 60, minimum);

    return canvas;
};

export const generateErrorCanvas = (data: {
    errorMessage: string;
}) => {
    const {
        canvas,
        ctx,
    } = generateBaseFrameCanvas();

    ctx.font = FONT;
    ctx.fillStyle = TEXT_COLOR;

    ctx.fillText(data.errorMessage, 60, 75);

    return canvas;
};