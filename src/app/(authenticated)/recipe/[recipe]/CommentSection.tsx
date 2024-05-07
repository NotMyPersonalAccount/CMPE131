"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Recipe, RecipeComment, User } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
	startTransition,
	useEffect,
	useOptimistic,
	useState,
	useTransition,
} from "react";
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
import { deleteComment, postComment } from "./action";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Image from "next/image";
import { EllipsisVerticalIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogFooter,
} from "@/components/ui/alert-dialog";

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
	recipeId,
	userId,
	initialComments,
}: {
	recipeId: string;
	userId: string;
	initialComments: Comment[];
}) {
	const [comments, setComments] = useOptimistic(
		initialComments,
		(comments, [action, data]: ["add", Comment] | ["delete", string]) => {
			switch (action) {
				case "add":
					return [data, ...comments];
				case "delete":
					return comments.filter((c) => c.id !== data);
			}
		},
	);

	return (
		<div className="flex flex-col gap-2 sm:gap-4">
			<CommentBox
				onSubmit={async (values) => {
					const newComment = await onSubmitComment(
						recipeId,
						null,
						values.content,
					);
					startTransition(() => {
						setComments(["add", newComment]);
					});
				}}
				showCancel={false}
			/>
			{comments.map((comment) => {
				return (
					<Comment
						key={comment.id}
						userId={userId}
						comment={comment}
						onDelete={() => setComments(["delete", comment.id])}
					/>
				);
			})}
		</div>
	);
}

export function CommentBox({
	value,
	onSubmit,
	onCancel,
	showCancel,
}: {
	value?: string;
	onSubmit?: (values: z.infer<typeof commentSchema>) => void;
	onCancel?: () => void;
	showCancel: boolean;
}) {
	const form = useForm<z.infer<typeof commentSchema>>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: value ?? "",
		},
	});

	useEffect(() => {
		form.setValue("content", value ?? "");
	}, [value]);

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

function Comment({
	userId,
	comment,
	onDelete,
}: {
	userId: string;
	comment: Comment & { children?: Comment[] };
	onDelete: () => void;
}) {
	const [isPending, startTransition] = useTransition();

	const [showActions, setShowActions] = useState(false);
	const [actionsOpen, setActionsOpen] = useState(false);
	const [replies, setReplies] = useOptimistic(
		comment.children ?? [],
		(replies, [action, data]: ["add", Comment] | ["delete", string]) => {
			switch (action) {
				case "add":
					return [data, ...replies];
				case "delete":
					return replies.filter((r) => r.id !== data);
			}
		},
	);
	const [replyBoxOpen, setReplyBoxOpen] = useState(false);

	return (
		<div>
			<div
				className="flex gap-3 w-full"
				onMouseEnter={() => setShowActions(true)}
				onMouseLeave={() => setShowActions(false)}
			>
				<div
					className={clsx("bg-gray-200 rounded-full overflow-hidden relative", {
						"w-12 h-12": comment.parentId === null,
						"w-8 h-8": comment.parentId !== null,
					})}
				>
					{comment.user.profileUrl && (
						<Image
							className="object-cover"
							fill={true}
							src={comment.user.profileUrl}
							alt={comment.user.name}
						/>
					)}
				</div>
				<div className="flex flex-col gap-1 flex-grow">
					<span>
						{comment.user.name}
						<CommentTimestamp
							className="text-xs text-muted-foreground ml-2"
							timestamp={comment.timestamp}
						/>
					</span>
					<div className="text-sm">
						{comment.content.split("\n").map((line, i) => (
							<p key={i}>{line}</p>
						))}
					</div>
					{comment.parentId === null && (
						<>
							<span
								className="text-blue-700 cursor-pointer"
								onClick={() => setReplyBoxOpen(true)}
							>
								Reply
							</span>
						</>
					)}
				</div>
				<div className="w-10">
					<AlertDialog>
						<DropdownMenu onOpenChange={setActionsOpen}>
							<DropdownMenuTrigger
								className={clsx(
									"p-2 outline-none focus:bg-secondary rounded-full",
									{
										invisible: !(showActions || actionsOpen),
										visible: showActions || actionsOpen,
									},
								)}
							>
								<EllipsisVerticalIcon />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onSelect={async () => {
										await navigator.clipboard.writeText(comment.content);
									}}
								>
									Copy
								</DropdownMenuItem>
								{comment.userId === userId && (
									<AlertDialogTrigger asChild>
										<DropdownMenuItem>Delete</DropdownMenuItem>
									</AlertDialogTrigger>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete comment?</AlertDialogTitle>
								<AlertDialogDescription>
									This cannot be undone. This will permanently delete your
									comment.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={async () => {
										startTransition(() => {
											onDelete();
										});
										await deleteComment(comment.id);
									}}
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
			{comment.parentId === null && (
				<div className="flex flex-col gap-2 mt-2 ml-16">
					{replyBoxOpen && (
						<CommentBox
							onSubmit={async (values) => {
								const newReply = await postComment(
									comment.recipeId,
									comment.id,
									values.content,
								);
								startTransition(() => {
									setReplies(["add", newReply]);
								});
								setReplyBoxOpen(false);
							}}
							onCancel={() => setReplyBoxOpen(false)}
							showCancel={true}
						/>
					)}
					<div className="flex flex-col gap-2 sm:gap-4">
						{replies.map((reply) => {
							return (
								<Comment
									key={reply.id}
									userId={userId}
									comment={reply}
									onDelete={() => {
										setReplies(["delete", reply.id]);
									}}
								/>
							);
						})}
					</div>
				</div>
			)}
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
