"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { commentSchema } from "./schema";
import { revalidatePath } from "next/cache";

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

export async function deleteComment(commentId: string) {
	const session = await getSession();
	if (!session) {
		throw new Error("Session not found");
	}

	const recipe = await prisma.recipeComment.delete({
		where: {
			id: commentId,
			userId: session.data.id,
		},
	});
	revalidatePath("/recipe/" + recipe.id);
	return true;
}

export async function likeRecipe(recipeId: string, liked: boolean) {
	const session = await getSession();
	if (!session) {
		throw new Error("Session not found");
	}

	return await prisma.$transaction(async (tx) => {
		const existingLike = await prisma.recipeLike.findUnique({
			where: {
				userAndRecipe: {
					userId: session.data.id,
					recipeId,
				},
			},
		});

		if (!existingLike) {
			await tx.recipeLike.create({
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
					liked,
				},
			});
		} else if (existingLike.liked !== liked) {
			await tx.recipeLike.update({
				where: {
					id: existingLike.id,
				},
				data: {
					liked,
				},
			});
		} else {
			return false;
		}

		await tx.recipe.update({
			where: {
				id: recipeId,
			},
			data: {
				likeScore: {
					increment: (liked ? 1 : -1) * (existingLike ? 2 : 1),
				},
			},
		});
		return true;
	});
}

export async function removeLike(recipeId: string) {
	const session = await getSession();
	if (!session) {
		throw new Error("Session not found");
	}

	return await prisma.$transaction(async (tx) => {
		const existingLike = await prisma.recipeLike.findUnique({
			where: {
				userAndRecipe: {
					userId: session.data.id,
					recipeId,
				},
			},
		});

		if (!existingLike) {
			return false;
		}

		await tx.recipeLike.delete({
			where: {
				id: existingLike.id,
			},
		});
		await tx.recipe.update({
			where: {
				id: recipeId,
			},
			data: {
				likeScore: {
					decrement: existingLike.liked ? 1 : -1,
				},
			},
		});
		return true;
	});
}
