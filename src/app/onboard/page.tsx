import prisma from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Onboard() {
	const session = await getSession();
	if (!session) {
		redirect("/api/auth/login");
	}

	const user = await prisma.user.findUnique({
		where: {
			email: session.user.email,
		},
	});
	if (user) {
		redirect("/home");
	}

	async function createUser(data: FormData) {
		"use server";

		const session = await getSession();
		if (!session) {
			throw new Error("Session not found");
		}

		await prisma.user.create({
			data: {
				email: session.user.email,
				name: data.get("name") as string,
			},
		});

		redirect("/home");
	}

	return (
		<form action={createUser}>
			<label>
				Name:
				<input type="text" name="name" />
			</label>
			<input type="submit" value="Submit" />
		</form>
	);
}
