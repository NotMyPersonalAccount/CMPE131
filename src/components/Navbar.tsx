import { getSession } from "@auth0/nextjs-auth0";
import NavbarContent from "./NavbarContent";

interface Props {
	bordered?: boolean;
}

export default async function Navbar(props: Props) {
	const session = await getSession();
	return <NavbarContent {...props} session={JSON.stringify(session)}/>;
}
