"use server";

import { getSession } from "@auth0/nextjs-auth0";
import prisma from "./prisma";

export async function deleteUser() {
    const session = (await getSession())!;
    await prisma.user.delete({
        where: {
            email: session.user.email,
        },
    });
}
