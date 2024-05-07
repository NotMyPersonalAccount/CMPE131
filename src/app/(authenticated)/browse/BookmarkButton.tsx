"use client";

import { BookmarkIcon, LucideProps } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { bookmarkRecipe } from "./action";
import clsx from "clsx";

export default function BookmarkButton({
	recipeId,
	bookmarked: _bookmarked,
	className,
	...props
}: {
	recipeId: string;
	bookmarked: boolean;
} & LucideProps) {
	const [_, startTransition] = useTransition();
	const [bookmarked, setBookmarked] = useOptimistic(
		_bookmarked,
		(_, bookmarked: boolean) => {
			return bookmarked;
		},
	);

	return (
		<BookmarkIcon
			className={clsx("cursor-pointer", className)}
			fill={bookmarked ? "currentColor" : "none"}
			onClick={async () => {
				startTransition(() => setBookmarked(!bookmarked));
				await bookmarkRecipe(recipeId, !bookmarked);
			}}
		/>
	);
}
