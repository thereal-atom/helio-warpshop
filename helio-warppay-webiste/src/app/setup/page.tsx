import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Setup a Helio Warpshop",
};

export default function Setup() {
    async function createStoreFront(formData: FormData) {
        "use server";

        const rawFormData = {
            storeName: formData.get("store-name"),
            storedDescription: formData.get("store-description"),
        };

        console.log(rawFormData);
    };

    return (
        <main className="flex flex-col min-h-screen items-center justify-center">
            <div className="flex flex-col w-[800px] p-16 bg-secondary rounded-md">
                <h2 className="text-3xl font-black">Create a Storefront with Helio and Warpcast</h2>
                <div className="flex flex-col w-full mt-16">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold opacity-80">Shop Details</h2>
                        <form
                            className="flex flex-col mt-4"
                            action={createStoreFront}
                        >
                            <label
                                className="mt-2 text-secondary-text text-sm"
                                htmlFor="store-name"
                            >
                                Store Name
                            </label>
                            <input
                                className="mt-1 p-2 bg-primary-background rounded-md border border-tertiary"
                                type="text"
                                name="store-name"
                            />
                            <label
                                className="mt-2 text-secondary-text text-sm"
                                htmlFor="store-description"
                            >
                                Store Description
                            </label>
                            <input
                                className="mt-1 p-2 bg-primary-background rounded-md border border-tertiary"
                                type="text"
                                name="store-description"
                            />
                            <button className="w-full mt-4 py-2 bg-accent font-semibold text-center rounded-md">Save</button>
                        </form>
                    </div>
                    {/* <div className="flex flex-col mt-16">
                        <h2 className="text-2xl font-bold">Product Details</h2>
                        <form
                            className="flex flex-col mt-8"
                            action=""
                        >
                            <label
                                className="mt-2"
                                htmlFor="product-name"
                            >
                                Product Name
                            </label>
                            <input
                                className="mt-2 p-2 bg-black rounded-md border border-secondary"
                                type="text"
                                name="product-name"
                            />
                            <label
                                className="mt-2"
                                htmlFor="product-description"
                            >
                                Product Description
                            </label>
                            <input
                                className="mt-2 p-2 bg-black rounded-md border border-secondary"
                                type="text"
                                name="product-description"
                            />
                            <label
                                className="mt-2"
                                htmlFor="produce-price"
                            >
                                Product Price
                            </label>
                            <input
                                className="mt-2 p-2 bg-black rounded-md border border-secondary"
                                type="text"
                                name="produce-price"
                            />
                            <button className="w-full mt-4 py-2 bg-accent font-semibold text-center rounded-md">Create Product</button>
                        </form>
                    </div> */}
                </div>
            </div>
        </main>
    );
};