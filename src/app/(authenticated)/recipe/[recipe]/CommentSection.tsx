"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Recipe, RecipeComment, User } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { commentSchema } from "./schema";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import { postComment } from "./action";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

dayjs.extend(relativeTime);

type Comment = RecipeComment & { user: User };

async function onSubmitComment(recipeId: string, comment: string) {
	return await postComment(recipeId, comment);
}

export default function CommentSection({
	recipe,
	initialComments,
}: {
	recipe: Recipe;
	initialComments: Comment[];
}) {
	const form = useForm<z.infer<typeof commentSchema>>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: "",
		},
	});
	const [comments, setComments] = useState(initialComments);

	return (
		<div className="flex flex-col gap-2 sm:gap-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(async (values) => {
						const newComment = await onSubmitComment(recipe.id, values.content);
						setComments((comments) => [newComment, ...comments]);
					})}
					className="flex flex-col gap-2"
				>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => {
							return (
								<FormItem>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<SubmitButton submitting={form.formState.isSubmitting} />
				</form>
			</Form>
			<div className="flex flex-col gap-2 sm:gap-4">
				{comments.map((comment) => {
					return <Comment key={comment.id} comment={comment} />;
				})}
			</div>
		</div>
	);
}

function Comment({ comment }: { comment: Comment }) {
	return (
		<div className="flex gap-2" key={comment.id}>
			<div className="bg-gray-200 w-12 h-12 rounded-full" />
			<div className="flex flex-col gap-1">
				<span>
					{comment.user.name}
					<CommentTimestamp
						className="text-xs text-muted-foreground ml-1"
						timestamp={comment.timestamp}
					/>
				</span>
				<span className="text-sm">{comment.content}</span>
			</div>
		</div>
	);
}

function CommentTimestamp({
	className,
	timestamp,
}: {
	className: string;
	timestamp: Date;
}) {
	const [relative, setRelative] = useState(dayjs(timestamp).fromNow());
	useEffect(() => {
		let interval: ReturnType<typeof setInterval>;

		const timeout = setTimeout(() => {
			interval = setInterval(() => {
				setRelative(dayjs(timestamp).fromNow());
			}, 1000 * 60);
		}, 60 - timestamp.getSeconds());

		return () => {
			clearTimeout(timeout);
			if (interval) clearInterval(interval);
		};
	}, [timestamp]);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<span className={className}>{relative}</span>
				</TooltipTrigger>
				<TooltipContent>
					{dayjs(timestamp).format("dddd, MMMM D, YYYY hh:mm A")}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
