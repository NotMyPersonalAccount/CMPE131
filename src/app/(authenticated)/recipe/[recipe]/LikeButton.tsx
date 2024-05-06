"use client";

import {
	SeparatorHorizontal,
	SeparatorVerticalIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
} from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { likeRecipe, removeLike } from "./action";
import { Button } from "@/components/ui/button";

export default function LikeButton({
	recipeId,
	likedBefore: _likedBefore,
	liked: _liked,
	likes: _likes,
	dislikes: _dislikes,
}: {
	recipeId: string;
	likedBefore: boolean;
	liked: boolean;
	likes: number;
	dislikes: number;
}) {
	const [_, startTransition] = useTransition();
	const [likedBefore, setLikedBefore] = useOptimistic(
		_likedBefore,
		(_, likedBefore: boolean) => {
			return likedBefore;
		},
	);
	const [liked, setLiked] = useOptimistic(_liked, (_, liked: boolean) => {
		return liked;
	});
	const [likes, setLikes] = useOptimistic(_likes, (state, liked: boolean) => {
		return state + (liked ? 1 : -1);
	});
	const [dislikes, setDislikes] = useOptimistic(
		_dislikes,
		(state, disliked: boolean) => {
			return state + (disliked ? 1 : -1);
		},
	);

	return (
		<div className="flex items-center">
			<Button
				variant="secondary"
				className="flex gap-2 rounded-tr-none rounded-br-none"
				onClick={async () => {
					startTransition(() => {
						setLikedBefore(!(likedBefore && liked));
						setLiked(!(likedBefore && liked));
						setLikes(!(likedBefore && liked));
						if (likedBefore && !liked) setDislikes(false);
					});
					if (likedBefore && liked) {
						await removeLike(recipeId);
					} else {
						await likeRecipe(recipeId, true);
					}
				}}
			>
				<ThumbsUpIcon fill={likedBefore && liked ? "currentColor" : "none"} />
				{likes}
			</Button>
			<div className="flex h-full items-center bg-secondary">
				<div className="w-[0.1rem] h-6 bg-primary" />
			</div>
			<Button
				variant="secondary"
				className="flex gap-2 rounded-tl-none rounded-bl-none"
				onClick={async () => {
					startTransition(() => {
						setLikedBefore(!(likedBefore && !liked));
						setLiked(false);
						setDislikes(!(likedBefore && !liked));
						if (likedBefore && liked) setLikes(false);
					});
					if (likedBefore && !liked) {
						await removeLike(recipeId);
					} else {
						await likeRecipe(recipeId, false);
					}
				}}
			>
				<ThumbsDownIcon
					fill={likedBefore && !liked ? "currentColor" : "none"}
				/>
				{dislikes}
			</Button>
		</div>
	);
}
