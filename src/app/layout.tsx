import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
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
					{children}
				</body>
			</UserProvider>
		</html>
	);
}
