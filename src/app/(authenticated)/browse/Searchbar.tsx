"use client";

import { Input, InputProps } from "@/components/ui/input";
import clsx from "clsx";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Searchbar(props: InputProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(searchParams.get("search") ?? "");
	const [searchValue] = useDebounce(search, 800);
	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		if (searchValue.trim() !== "") {
			params.set("search", searchValue);
		} else {
			params.delete("search");
		}
		params.delete("page");
		router.push(pathname + "?" + params.toString());
	}, [searchValue, searchParams, router, pathname]);

	return (
		<div className="relative">
			<SearchIcon className="text-muted-foreground w-4 h-4 absolute left-2.5 top-2.5" />
			<Input
				placeholder="Search"
				{...props}
				className={clsx("pl-8", props.className)}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
		</div>
	);
}
