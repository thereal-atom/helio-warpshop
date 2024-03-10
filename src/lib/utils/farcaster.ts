import { FarcasterFrameButtonData, FarcasterFrameData, FarcasterFrameMetatags } from "../types/farcaster";

export const generateFarcasterButtonMetatags = (data: FarcasterFrameButtonData) => {
    return {
        [`fc:frame:button:${data.index}`]: data.label,
        [`fc:frame:button:${data.index}:action`]: data.action,
        [`fc:frame:button:${data.index}:target`]: data.target,
    };
};

export const generateFarcasterMetatags = (data: FarcasterFrameData): Record<string, any> => {
    const buttonsMetatags = data.buttons
        ? data.buttons
            .map(generateFarcasterButtonMetatags)
            .reduce((r, c) => Object.assign(r, c), {})
        : [];

    const farcasterMetatags: FarcasterFrameMetatags = {
        ["fc:frame"]: "vNext",
        ["fc:frame:image"]: data.imageUrl,
        ...buttonsMetatags,
    };

    if (data.postUrl) farcasterMetatags["fc:frame:post_url"] = data.postUrl;
    if (data.inputText) farcasterMetatags["fc:frame:input:text"] = data.inputText;
    if (data.imageAspectRatio) farcasterMetatags["fc:frame:image:aspect_ratio"] = data.imageAspectRatio;
    if (data.state) farcasterMetatags["fc:frame:state"] = data.state;

    return farcasterMetatags;
};