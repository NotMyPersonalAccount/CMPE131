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
		},
	});

	await updateSession({
		...session,
		data: {
			id: user.id,
			name: user.name,
			email: user.email,
		},
	});

	redirect("/browse");
}
