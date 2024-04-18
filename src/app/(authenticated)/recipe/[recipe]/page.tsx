import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CommentSection, { CommentBox } from "./CommentSection";
import { Separator } from "@/components/ui/separator";
import BackButton from "./BackButton";
import { Suspense } from "react";
import { LoaderIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default async function RecipePage({
	params,
}: {
	params: { recipe: string };
}) {
	return (
		<>
			<BackButton />
			<section className="py-16 px-8 md:px-16 xl:px-32 flex flex-col gap-2 sm:gap-4">
				<Suspense fallback={<RecipeSkeleton />}>
					<Recipe id={params.recipe} />
					<Separator className="my-8" />
					<Suspense fallback={<CommentsSkeleton />}>
						<Comments recipeId={params.recipe} />
					</Suspense>
				</Suspense>
			</section>
		</>
	);
}

async function Recipe({ id }: { id: string }) {
	const recipe = await prisma.recipe
		.findUnique({
			where: {
				id,
			},
		})
		.catch(() => null);

	if (!recipe) return notFound();

	return (
		<>
			<div>
				<h1 className="text-2xl sm:text-4xl font-bold">{recipe.title}</h1>
				<h2 className="text-md sm:text-lg text-muted-foreground">
					{recipe.description}
				</h2>
			</div>
			<div className="bg-gray-200 w-full h-40 sm:h-80 lg:h-96 rounded-md overflow-hidden relative">
				{recipe.bannerUrl && (
					<Image
						src={recipe.bannerUrl}
						alt={recipe.title}
						layout="fill"
						objectFit="cover"
					/>
				)}
			</div>
			<Card className="min-h-40">
				<CardContent className="py-4">{recipe.content}</CardContent>
			</Card>
		</>
	);
}

function RecipeSkeleton() {
	return (
		<>
			<div>
				<Skeleton className="sm:w-96 h-8 sm:h-10" />
				<Skeleton className="h-6 sm:h-7 mt-1" />
			</div>
			<Skeleton className="h-40 sm:h-80 lg:h-96" />
			<Skeleton className="h-40" />
			<Separator className="my-8" />
			<CommentsSkeleton />
		</>
	);
}

async function Comments({ recipeId }: { recipeId: string }) {
	const comments = await prisma.recipeComment.findMany({
		where: {
			recipeId,
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
			<CommentSection recipeId={recipeId} initialComments={comments} />
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
