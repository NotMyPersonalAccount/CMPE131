"use server";

import prisma from "@/lib/prisma";
import { getSession, updateSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createFormSchema } from "./schema";

export async function createRecipe(values: z.infer<typeof createFormSchema>) {
	const { success } = createFormSchema.safeParse(values);
	if (!success) {
		throw new Error("Invalid data");
	}

	const session = await getSession();
	if (!session) {
		throw new Error("Session not found");
	}
	if (!session.data) {
		throw new Error("User not onboarded");
	}

	const recipe = await prisma.recipe.create({
		data: {
			userId: session.data.id,
			title: values.title,
			description: values.description,
			content: values.content,
			bannerUrl: values.bannerUrl,
		},
	});

	redirect("/browse");
}
