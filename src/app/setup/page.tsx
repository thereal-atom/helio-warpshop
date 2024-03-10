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

    return (
        <main className="flex flex-col min-h-screen items-center justify-center">
            <div className="flex flex-col w-[800px] p-16 bg-secondary rounded-md">
                <h2 className="text-3xl font-black">Generate a link for a Warpcast Frame</h2>
                <div className="flex flex-col w-full mt-16">
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
                                onClick={() => {
                                    if (!helioPaylink) {
                                        return;
                                    };

                                    const paylinkId = new URL(helioPaylink).pathname
                                        .split("/")
                                        .slice(-1, 100)[0];

                                    setWarpcastLink(`${window.location.origin}/shop/${paylinkId}`);
                                }}
                            >
                                Generate
                            </button>
                        </div>
                        <p className="mt-8">Your Warpcast Link: <a className="text-accent" href={warpcastLink}>{warpcastLink}</a></p>
                    </div>
                </div>
            </div>
        </main>
    );
};