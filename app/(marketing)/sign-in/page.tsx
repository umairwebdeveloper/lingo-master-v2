"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <SignIn path="/sign-in" routing="path" />
            </div>
        </div>
    );
}
