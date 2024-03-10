export type FarcasterButtonAction = "link" | "post" | "post_redirect" | "mint";

export interface FarcasterFrameButtonData {
    index: number | 1 | 2 | 3 | 4;
    label: string;
    action: FarcasterButtonAction;
    target: string;
};

export interface FarcasterFrameData {
    imageUrl: string;
    postUrl?: string;
    inputText?: string;
    imageAspectRatio?: "1.91:1" | "1:1";
    state?: string;
    buttons?: FarcasterFrameButtonData[];
};

export interface FarcasterFrameMetatags {
    ["fc:frame"]: string | "vNext";
    ["fc:frame:image"]: string;
    ["fc:frame:post_url"]?: string;
    ["fc:frame:input:text"]?: string;
    ["fc:frame:image:aspect_ratio"]?: "1:1" | "1.91:1";
    ["fc:frame:state"]?: string;

    [`fc:frame:button:1`]?: string;
    [`fc:frame:button:1:action`]?: FarcasterButtonAction;
    [`fc:frame:button:1:target`]?: string;
    
    [`fc:frame:button:2`]?: string;
    [`fc:frame:button:2:action`]?: FarcasterButtonAction;
    [`fc:frame:button:2:target`]?: string;
    
    [`fc:frame:button:3`]?: string;
    [`fc:frame:button:3:action`]?: FarcasterButtonAction;
    [`fc:frame:button:3:target`]?: string;
    
    [`fc:frame:button:4`]?: string;
    [`fc:frame:button:4:action`]?: FarcasterButtonAction;
    [`fc:frame:button:4:target`]?: string;
};