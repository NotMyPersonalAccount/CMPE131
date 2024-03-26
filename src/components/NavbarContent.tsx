"use client";

import { Session } from "@auth0/nextjs-auth0";
import { cn } from "@/lib/utils";
import { Cross as Hamburger } from "hamburger-react";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

interface Props {
	bordered?: boolean;
	onboarded?: boolean;
	session: string;
}

interface UserMenuProps {
	className?: string;
	session: Session | undefined | null;
}

interface NavbarLinksProps {
	onboarded?: boolean;
}

function UserMenu({ className, session }: UserMenuProps) {
	const { theme, setTheme } = useTheme();

	return (
		<div className={className}>
			{session ? (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Image
							className="rounded-full"
							alt="Profile Picture"
							src={session.user.picture}
							width={32}
							height={32}
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/your-recipes">Your Recipes</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/settings">Settings</Link>
							</DropdownMenuItem>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem
											disabled={theme === "light"}
											onSelect={() => setTheme("light")}
										>
											Light
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={theme === "dark"}
											onSelect={() => setTheme("dark")}
										>
											Dark
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={theme === "system"}
											onSelect={() => setTheme("system")}
										>
											System
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/api/auth/logout">Logout</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button asChild>
					<Link href="/api/auth/login">Login</Link>
				</Button>
			)}
		</div>
	);
}

function NavbarLinks({ onboarded }: NavbarLinksProps) {
	return (
		onboarded !== false && (
			<>
				<Link className="text-foreground/60" href="/browse">
					Browse
				</Link>
				<Link className="text-foreground/60" href="/create">
					Create
				</Link>
			</>
		)
	);
}

export default function NavbarContent({
	bordered,
	onboarded,
	session: _session,
}: Props) {
	const session: Session | undefined | null = JSON.parse(_session);
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia("(min-width: 640px)");
		mql.onchange = (e) => {
			if (e.matches) {
				setOpen(false);
			}
		};
	}, []);
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	return (
		<div
			className={cn("px-8 sm:px-24 py-4 sm:flex justify-between items-center", {
				"border-b": bordered,
			})}
		>
			<div className="flex justify-between items-center gap-8">
				<div className="flex justify-between items-center w-full">
					<div className="flex justify-between items-center gap-3">
						<div
							className={cn("sm:hidden w-8 h-8 -mt-4 -ml-4", {
								hidden: onboarded === false,
							})}
						>
							<Popover open={open} onOpenChange={(open) => setOpen(open)}>
								<PopoverTrigger>
									<Hamburger size={16} toggled={open} />
								</PopoverTrigger>
								<PopoverContent className="ml-8 w-[calc(100vw-4rem)]">
									<div className="flex flex-col">
										<NavbarLinks />
									</div>
								</PopoverContent>
							</Popover>
						</div>
						<Link className="font-semibold mr-6" href="/">
							Flavatown
						</Link>
					</div>
					<UserMenu className="sm:hidden" session={session} />
				</div>
				<div className="hidden sm:flex gap-6">
					<NavbarLinks onboarded={onboarded} />
				</div>
			</div>
			<UserMenu className="hidden sm:block" session={session} />
		</div>
	);
}
