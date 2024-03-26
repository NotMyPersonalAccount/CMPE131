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
import { HeartIcon } from "lucide-react";
import Searchbar from "./Searchbar";

export async function RecipeBrowser({
	title,
	userId,
	searchParams,
}: {
	title: string;
	userId?: string;
	searchParams: {
		search?: string;
		page?: string;
	};
}) {
	const [recipeCount, recipes] = await prisma.$transaction([
		prisma.recipe.count(),
		prisma.recipe.findMany({
			include: {
				user: true,
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

	return (
		<section className="py-16 px-8 md:px-16 xl:px-32">
			<div className="flex flex-wrap justify-between gap-4">
				<h1 className="font-bold text-4xl">{title ?? "Recipes"}</h1>
				<Searchbar className="max-w-96" />
			</div>
			<div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
				{recipes.map((recipe) => {
					return (
						<Card key={recipe.id}>
							<div className="w-full h-32 bg-gray-200"></div>
							<CardHeader>
								<CardTitle>{recipe.title}</CardTitle>
								<CardDescription>{recipe.description}</CardDescription>
							</CardHeader>
							<Separator />
							<CardFooter>
								<div className="w-full mt-6 flex justify-between items-center">
									<div className="flex gap-1">
										0
										<HeartIcon />
									</div>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
											</TooltipTrigger>
											<TooltipContent>{recipe.user.name}</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</CardFooter>
						</Card>
					);
				})}
			</div>
		</section>
	);
}

export default async function BrowsePage({
	searchParams,
}: {
	searchParams: {
		search?: string;
		page?: string;
	};
}) {
	return <RecipeBrowser title="Recipes" searchParams={searchParams} />;
}
