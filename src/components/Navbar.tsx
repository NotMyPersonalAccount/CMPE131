import { getSession } from "@auth0/nextjs-auth0";
import Debug from "./Debug";

export default async function Navbar() {
	const session = await getSession();

	return (
		<>
			<a href={`/api/auth/${session?.user ? "logout" : "login"}`}>
				{session?.user ? "Logout" : "Login"}
			</a>
			<br />
			{session && (
				<>
					<p>Logged in as {session?.user.name}</p>
					<Debug />
				</>
			)}
		</>
	);
}
