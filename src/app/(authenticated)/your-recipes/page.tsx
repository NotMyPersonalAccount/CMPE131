import { getSession } from "@auth0/nextjs-auth0";
import { RecipeBrowser } from "../browse/page";

export default async function YourRecipesPage({
	searchParams,
}: {
	searchParams: {
		search?: string;
		page?: string;
	};
}) {
	const session = (await getSession())!;
    
	return (
		<RecipeBrowser
			title="Your Recipes"
			searchParams={searchParams}
			userId={session.data.id}
		/>
	);
}
