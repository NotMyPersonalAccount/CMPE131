import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CommentSection, { CommentBox } from "./CommentSection";
import { Separator } from "@/components/ui/separator";
import BackButton from "./BackButton";
import { Recipe } from "@prisma/client";
import { Suspense } from "react";
import { LoaderIcon } from "lucide-react";

export default async function RecipePage({
	params,
}: {
	params: { recipe: string };
}) {
	const recipe = await prisma.recipe.findUnique({
		where: {
			id: params.recipe,
		},
	});
	if (!recipe) return notFound();

	return (
		<>
			<BackButton />
			<section className="py-16 px-8 md:px-16 xl:px-32 flex flex-col gap-2 sm:gap-4">
				<div>
					<h1 className="text-2xl sm:text-4xl font-bold">{recipe.title}</h1>
					<h2 className="text-md sm:text-lg text-muted-foreground">
						{recipe.description}
					</h2>
				</div>
				<div className="bg-gray-200 w-full h-40 sm:h-80 lg:h-96 rounded-md"></div>
				<Card className="min-h-40">
					<CardContent className="py-4">{recipe.content}</CardContent>
				</Card>
				<Separator className="my-8" />
				<Suspense fallback={<CommentsSkeleton />}>
					<Comments recipe={recipe} />
				</Suspense>
			</section>
		</>
	);
}

async function Comments({ recipe }: { recipe: Recipe }) {
	const comments = await prisma.recipeComment.findMany({
		where: {
			recipeId: recipe.id,
			parent: null,
		},
		include: {
			user: true,
			children: {
				include: {
					user: true,
				},
			},
		},
		orderBy: [
			{
				timestamp: "desc",
			},
		],
	});

	return (
		<div>
			<h1 className="font-bold text-lg">Comments</h1>
			<CommentSection recipe={recipe} initialComments={comments} />
		</div>
	);
}

function CommentsSkeleton() {
	return (
		<div>
			<h1 className="font-bold text-lg">Comments</h1>
			<CommentBox showCancel={false} />
			<div className="flex justify-center">
				<LoaderIcon className="animate-spin" />
			</div>
		</div>
	);
}
