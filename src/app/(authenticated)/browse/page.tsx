import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { HeartIcon } from "lucide-react";

export default async function BrowsePage() {
	const recipes = await prisma.recipe.findMany({});
	return (
		<section className="py-16 px-10 sm:px-36">
			<div className="flex flex-wrap justify-between gap-4">
				<h1 className="font-bold text-4xl">Recipes</h1>
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
									<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
								</div>
							</CardFooter>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
