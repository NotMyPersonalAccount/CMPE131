import { getSession } from "@auth0/nextjs-auth0";
import { RecipeBrowser } from "../browse/RecipeBrowser";

export default async function BookmarksPage({
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
			title="Bookmarks"
			where={{
				bookmarks: {
					some: {
						userId: {
							equals: session.data.id,
						},
					},
				},
			}}
			searchParams={searchParams}
		/>
	);
}
