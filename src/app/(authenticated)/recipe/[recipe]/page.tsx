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
import LikeButton from "./LikeButton";
import { getSession } from "@auth0/nextjs-auth0";

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
	const session = (await getSession())!;
	const [recipe, likes, dislikes] = await Promise.all([
		await prisma.recipe
			.findUnique({
				where: {
					id,
				},
				include: {
					likes: {
						where: {
							userId: session.data.id,
						},
					},
				},
			})
			.catch(() => null),
		await prisma.recipeLike.count({
			where: {
				recipeId: id,
				liked: true,
			},
		}),
		await prisma.recipeLike.count({
			where: {
				recipeId: id,
				liked: false,
			},
		}),
	]);

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
						className="object-cover"
						fill={true}
						src={recipe.bannerUrl}
						alt={recipe.title}
					/>
				)}
			</div>
			<Card className="min-h-40">
				<CardContent className="py-4">{recipe.content}</CardContent>
			</Card>
			<div className="flex justify-end">
				<LikeButton
					recipeId={recipe.id}
					likedBefore={recipe.likes.length > 0}
					liked={recipe.likes[0]?.liked ?? false}
					likes={likes}
					dislikes={dislikes}
				/>
			</div>
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
