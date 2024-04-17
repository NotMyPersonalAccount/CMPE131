"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { commentSchema } from "./schema";

export async function postComment(
	recipeId: string,
	parentId: string | null,
	comment: string,
) {
	const session = await getSession();
	if (!session) {
		throw new Error("Session not found");
	}

	if (!commentSchema.safeParse({ content: comment })) {
		throw new Error("Invalid data");
	}

	return await prisma.recipeComment.create({
		data: {
			recipe: {
				connect: {
					id: recipeId,
				},
			},
			user: {
				connect: {
					id: session.data.id,
				},
			},
			parent: parentId
				? {
						connect: {
							id: parentId,
						},
					}
				: undefined,
			content: comment,
		},
		include: {
			user: true,
		},
	});
}
