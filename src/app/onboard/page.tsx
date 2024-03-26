import prisma from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import OnboardForm from "./OnboardForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

export default async function Onboard() {
	const session = (await getSession())!;
	const user = await prisma.user.findUnique({
		where: {
			email: session.user.email,
		},
	});
	if (user) {
		redirect("/browse");
	}

	return (
		<>
			<Navbar bordered={true} onboarded={false} />
			<section className="px-6 max-w-[600px] mx-auto py-16">
				<Card>
					<CardHeader>
						<CardTitle>Basic Info</CardTitle>
					</CardHeader>
					<CardContent>
						<OnboardForm />
					</CardContent>
				</Card>
			</section>
		</>
	);
}
