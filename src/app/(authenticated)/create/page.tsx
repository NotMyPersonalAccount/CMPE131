import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateForm from "./CreateForm";

export default async function Onboard() {
	return (
		<>
			<section className="px-6 sm:px-24 mx-auto py-16">
				<Card>
					<CardHeader>
						<CardTitle>Create Recipe</CardTitle>
					</CardHeader>
					<CardContent>
						<CreateForm />
					</CardContent>
				</Card>
			</section>
		</>
	);
}
