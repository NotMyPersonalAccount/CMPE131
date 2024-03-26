import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<>
			<Navbar />
			<section className="flex flex-col px-6 py-24 items-center gap-6">
				<div className="flex flex-col gap-2 items-center text-center">
					<h1 className="text-3xl sm:text-6xl font-bold">
						Create and share recipes
					</h1>
					<span className="text-muted-foreground text-lg sm:text-xl max-w-[250px] sm:max-w-[600px]">
						Join a community of people in creating and sharing recipes. Find new
						recipes to try out. Explore new tastes and new cuisines.
					</span>
				</div>
				<div>
					<Button asChild>
						<Link href="/browse">Join Today</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
