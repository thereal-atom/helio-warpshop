"use client";

import { useState } from "react";

export default function Setup() {
    const [
        helioPaylink,
        setHelioPaylink,
    ] = useState("");

    const [
        warpcastLink,
        setWarpcastLink,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        if (!helioPaylink) {
            return;
        };

        const urlRegex = new RegExp(
            "^(http|https)://",
            "i"
        );

        if (!urlRegex.test(helioPaylink)) {
            setError("Invalid URL");

            return;
        };

        setError("");

        const paylinkId = new URL(helioPaylink).pathname
            .split("/")
            .slice(-1, 100)[0];

        setWarpcastLink(`${window.location.origin}/shop/${paylinkId}`);
    };

    return (
        <main className="flex flex-col min-h-screen items-center justify-center">
            <div className="flex flex-col w-[800px] p-16 bg-secondary rounded-md">
                <h2 className="text-3xl font-black">Generate a link for a Warpcast Frame</h2>
                {
                    error ? (
                        <p className="mt-4 text-red-400">{error}</p>
                    ) : null
                }
                <form
                    className="flex flex-col w-full mt-16"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col w-full mt-4">
                            <label
                                className="mt-2 text-secondary-text text-sm"
                                htmlFor="store-name"
                            >
                                Helio Paylink
                            </label>
                            <input
                                className="mt-1 p-2 bg-primary-background rounded-md border border-tertiary"
                                type="text"
                                name="helio-paylink"
                                onChange={e => setHelioPaylink(e.target.value)}
                            />
                            <button
                                className="w-full mt-4 py-2 bg-accent font-semibold text-center rounded-md"
                                type="submit"
                            >
                                Generate
                            </button>
                        </div>
                        <p className="mt-8">Your Warpcast Link: <a className="text-accent" href={warpcastLink}>{warpcastLink}</a></p>
                        {
                            warpcastLink ? (
                                // give feedback when they copy the link
                                <button
                                    className="w-fit mt-8 px-4 py-2 bg-blue-400 font-semibold text-center rounded-md"
                                    onClick={() => {
                                        navigator.clipboard.writeText(warpcastLink);

                                        alert("Link copied to clipboard!");
                                    }}
                                >
                                    Copy Link
                                </button>
                            ) : null
                        }
                    </div>
                </form>
            </div>
        </main>
    );
};