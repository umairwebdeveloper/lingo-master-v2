import { isAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";

export const GET = async () => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const userList = await users.getUserList();

    const simplifiedUsers = userList.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses?.[0]?.emailAddress || null,
        createdAt: new Date(user.createdAt).toLocaleString(),
    }));

    return NextResponse.json(simplifiedUsers);
};
