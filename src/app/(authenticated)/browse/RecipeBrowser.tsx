import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import prisma from "@/lib/prisma";
import { HeartIcon, MessageSquareTextIcon } from "lucide-react";
import Searchbar from "./Searchbar";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@auth0/nextjs-auth0";

interface RecipeContentProps {
	title: string;
	userId?: string;
	searchParams: {
		search?: string;
		page?: string;
	};
}

export async function RecipeSkeletons() {
	return Array(10)
		.fill("")
		.map((_, i) => {
			return (
				<Card key={i}>
					<Skeleton className="h-96" />
				</Card>
			);
		});
}

export async function RecipeBrowserContent({
	userId,
	searchParams,
}: RecipeContentProps) {
	const session = (await getSession())!;
	const [recipeCount, recipes] = await prisma.$transaction([
		prisma.recipe.count(),
		prisma.recipe.findMany({
			include: {
				user: true,
				likes: {
					where: {
						userId: session.data.id,
					},
				},
				_count: {
					select: { comments: true },
				},
			},
			where: {
				OR: searchParams.search
					? [
							{ title: { contains: searchParams.search, mode: "insensitive" } },
							{
								description: {
									contains: searchParams.search,
									mode: "insensitive",
								},
							},
						]
					: undefined,
				userId: userId,
			},
			skip: searchParams.page
				? (Math.min(parseInt(searchParams.page), 1) - 1) * 20
				: 0,
			take: 20,
		}),
	]);

	return recipes.map((recipe) => {
		return (
			<Card key={recipe.id} className="overflow-hidden">
				<Link href={"/recipe/" + recipe.id + "?showBack"}>
					<div className="w-full h-48 bg-gray-200 relative">
						{recipe.bannerUrl && (
							<Image
								src={recipe.bannerUrl}
								alt={recipe.title}
								layout="fill"
								objectFit="cover"
							/>
						)}
					</div>
				</Link>
				<CardHeader>
					<CardTitle>
						<Link href={"/recipe/" + recipe.id + "?showBack"}>
							{recipe.title}
						</Link>
					</CardTitle>
					<CardDescription>{recipe.description}</CardDescription>
				</CardHeader>
				<Separator />
				<CardFooter>
					<div className="w-full mt-6 flex justify-between items-center">
						<div className="flex gap-2 sm:gap-4">
							<div className="flex gap-1">
								{recipe.likeScore}
								<HeartIcon
									fill={recipe.likes.length > 0 ? "red" : "none"}
									color={recipe.likes.length > 0 ? "red" : "currentColor"}
								/>
							</div>
							<div className="flex gap-1">
								{recipe._count.comments}
								<MessageSquareTextIcon />
							</div>
						</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden relative">
										{recipe.user.profileUrl && (
											<Image
												src={recipe.user.profileUrl}
												alt={recipe.user.name}
												layout="fill"
												objectFit="cover"
											/>
										)}
									</div>
								</TooltipTrigger>
								<TooltipContent>{recipe.user.name}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</CardFooter>
			</Card>
		);
	});
}

export async function RecipeBrowser(props: RecipeContentProps) {
	return (
		<section className="py-16 px-8 md:px-16 xl:px-32">
			<div className="flex flex-wrap justify-between gap-4">
				<h1 className="font-bold text-4xl">{props.title ?? "Recipes"}</h1>
				<Searchbar className="max-w-96" />
			</div>
			<div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
				<Suspense fallback={<RecipeSkeletons />}>
					<RecipeBrowserContent {...props}></RecipeBrowserContent>
				</Suspense>
			</div>
		</section>
	);
}
