import Navbar from "@/components/Navbar";

export default function AutheticatedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar bordered={true} />
			{children}
		</>
	);
}
