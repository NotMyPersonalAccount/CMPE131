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
import { Button } from "@/components/ui/button";
import clsx from "clsx";

dayjs.extend(relativeTime);

type Comment = RecipeComment & { user: User };

async function onSubmitComment(
	recipeId: string,
	parentId: string | null,
	comment: string,
) {
	return await postComment(recipeId, parentId, comment);
}

export default function CommentSection({
	recipe,
	initialComments,
}: {
	recipe: Recipe;
	initialComments: Comment[];
}) {
	const [comments, setComments] = useState(initialComments);

	return (
		<div className="flex flex-col gap-2 sm:gap-4">
			<div className="flex flex-col gap-2 sm:gap-4">
				<CommentBox
					onSubmit={async (values) => {
						const newComment = await onSubmitComment(
							recipe.id,
							null,
							values.content,
						);
						setComments((comments) => [newComment, ...comments]);
					}}
					showCancel={false}
				/>
				{comments.map((comment) => {
					return <Comment key={comment.id} comment={comment} />;
				})}
			</div>
		</div>
	);
}

function CommentBox({
	onSubmit,
	onCancel,
	showCancel,
}: {
	onSubmit?: (values: z.infer<typeof commentSchema>) => void;
	onCancel?: () => void;
	showCancel: boolean;
}) {
	const form = useForm<z.infer<typeof commentSchema>>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: "",
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(async (values) => {
					if (onSubmit) {
						await onSubmit(values);
					}
					form.setValue("content", "");
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
				<div className="justify-end flex gap-2">
					{showCancel && <Button onClick={() => onCancel?.()}>Cancel</Button>}
					<SubmitButton submitting={form.formState.isSubmitting} />
				</div>
			</form>
		</Form>
	);
}

function Comment({ comment }: { comment: Comment & { children?: Comment[] } }) {
	const [replies, setReplies] = useState(comment.children ?? []);
	const [replyBoxOpen, setReplyBoxOpen] = useState(false);

	return (
		<div className="flex gap-3 w-full">
			<div
				className={clsx("bg-gray-200 rounded-full", {
					"w-12 h-12": comment.parentId === null,
					"w-8 h-8": comment.parentId !== null,
				})}
			/>
			<div className="flex flex-col gap-1 flex-grow">
				<span>
					{comment.user.name}
					<CommentTimestamp
						className="text-xs text-muted-foreground ml-2"
						timestamp={comment.timestamp}
					/>
				</span>
				<span className="text-sm">{comment.content}</span>
				{comment.parentId === null && (
					<>
						<span
							className="text-blue-700 cursor-pointer"
							onClick={() => setReplyBoxOpen(true)}
						>
							Reply
						</span>
						{replyBoxOpen && (
							<CommentBox
								onSubmit={async (values) => {
									const newReply = await postComment(
										comment.recipeId,
										comment.id,
										values.content,
									);
									setReplies([...replies, newReply]);
									setReplyBoxOpen(false);
								}}
								onCancel={() => setReplyBoxOpen(false)}
								showCancel={true}
							/>
						)}
						<div className="flex flex-col gap-2 sm:gap-4 mt-2">
							{replies.map((reply) => {
								return <Comment key={reply.id} comment={reply} />;
							})}
						</div>
					</>
				)}
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
