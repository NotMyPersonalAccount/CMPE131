import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import { cn } from "@/lib/utils";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
	title: "Flavatown",
	description:
		"Join a community of people in creating and sharing recipes. Find new recipes to try out. Explore new tastes and new cuisines.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<UserProvider>
				<body
					className={cn("min-h-screen bg-background font-inter antialiased")}
				>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
					</ThemeProvider>
				</body>
			</UserProvider>
		</html>
	);
}
