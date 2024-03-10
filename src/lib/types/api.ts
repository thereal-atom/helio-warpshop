export type CustomRequestResult<ResponseType> = {
    success: true,
    data: ResponseType,
} | {
    success: false;
    error: {
        message: string;
    };
}; 