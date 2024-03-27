import { RecipeBrowser } from "./RecipeBrowser";

export default async function BrowsePage({
	searchParams,
}: {
	searchParams: {
		search?: string;
		page?: string;
	};
}) {
	return <RecipeBrowser title="Recipes" searchParams={searchParams} />;
}
