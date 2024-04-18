"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BackButton() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [visible] = useState(searchParams.has("showBack"));
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		if (visible) {
			const onScroll = () => {
				setScrolled(window.scrollY > 72);
			};
			window.addEventListener("scroll", onScroll);
			return () => window.removeEventListener("scroll", onScroll);
		}
	}, [visible]);

	useEffect(() => {
		if (searchParams.has("showBack")) {
			const newSearchParams = new URLSearchParams(searchParams.toString());
			newSearchParams.delete("showBack");
			router.replace(pathname + "?" + newSearchParams.toString());
		}
	}, [router, pathname, searchParams]);

	return (
		visible && (
			<>
				<div
					className={clsx("w-full bg-background", { "fixed top-0": scrolled })}
				>
					<Button
						className="ml-8 sm:ml-12 my-4 h-8 text-sm"
                        variant="secondary"
						onClick={() => router.back()}
					>
						<ChevronLeft /> Back
					</Button>
					<Separator />
				</div>
				{scrolled && <div className="mb-14" />}
			</>
		)
	);
}
