import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CommentSection from "./CommentSection";
import { Separator } from "@/components/ui/separator";

export default async function RecipePage({
	params,
}: {
	params: { recipe: string };
}) {
	const recipe = await prisma.recipe.findUnique({
		where: {
			id: params.recipe,
		},
		include: {
			comments: {
				include: {
					user: true,
					children: {
						include: {
							user: true
						}
					},
				},
				orderBy: [
					{
						timestamp: "desc",
					},
				],
			},
		},
	});
	if (!recipe) return notFound();

	return (
		<>
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
				<div>
					<h1 className="font-bold text-lg">Comments</h1>
					<CommentSection recipe={recipe} initialComments={recipe.comments} />
				</div>
			</section>
		</>
	);
}
