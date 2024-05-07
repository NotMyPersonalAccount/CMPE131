"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";

export async function bookmarkRecipe(recipeId: string, bookmarked: boolean) {
	const session = await getSession();
	if (!session) {
		throw new Error("Session not found");
	}

	return await prisma.$transaction(async (tx) => {
		const existingBookmark = await prisma.recipeBookmark.findUnique({
			where: {
				userAndRecipe: {
					userId: session.data.id,
					recipeId,
				},
			},
		});

		if (bookmarked && !existingBookmark) {
			await prisma.recipeBookmark.create({
				data: {
					user: {
						connect: {
							id: session.data.id,
						},
					},
					recipe: {
						connect: {
							id: recipeId,
						},
					},
				},
			});
			return true;
		}
		if (!bookmarked && existingBookmark) {
			await prisma.recipeBookmark.delete({
				where: {
					id: existingBookmark.id,
				},
			});
			return true;
		}

		return false;
	});
}
