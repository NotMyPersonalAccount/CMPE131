"use server";

import prisma from "@/lib/prisma";
import { getSession, updateSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { z } from "zod";
import { onboardFormSchema } from "./schema";

export async function createUser(values: z.infer<typeof onboardFormSchema>) {
	const { success } = onboardFormSchema.safeParse(values);
	if (!success) {
		throw new Error("Invalid data");
	}

	const session = await getSession();
	if (!session) {
		throw new Error("Session not found");
	}

	const user = await prisma.user.create({
		data: {
			email: session.user.email,
			name: values.name,
			profileUrl: session.user.picture, //TODO: Allow custom profile picture
		},
	});

	await updateSession({
		...session,
		data: user,
	});

	redirect("/browse");
}
