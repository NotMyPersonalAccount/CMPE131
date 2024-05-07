"use client";

import { BookmarkIcon, LucideProps } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { bookmarkRecipe } from "./action";
import clsx from "clsx";

export default function BookmarkButton({
	recipeId,
	bookmarked: _bookmarked,
	bookmarkedCount: _bookmarkedCount,
	className,
	...props
}: {
	recipeId: string;
	bookmarked: boolean;
	bookmarkedCount: number;
} & LucideProps) {
	const [_, startTransition] = useTransition();
	const [bookmarked, setBookmarked] = useOptimistic(
		_bookmarked,
		(_, bookmarked: boolean) => {
			return bookmarked;
		},
	);
	const [bookmarkedCount, setBookmarkedCount] = useOptimistic(
		_bookmarkedCount,
		(_, bookmarkedCount: number) => {
			return bookmarkedCount;
		},
	);

	return (
		<div
			className={clsx("flex gap-2 cursor-pointer", className)}
			onClick={async () => {
				startTransition(() => {
					setBookmarked(!bookmarked);
					setBookmarkedCount(bookmarkedCount + (bookmarked ? -1 : 1));
				});
				await bookmarkRecipe(recipeId, !bookmarked);
			}}
		>
			<BookmarkIcon fill={bookmarked ? "currentColor" : "none"} {...props} />
			{bookmarkedCount}
		</div>
	);
}
