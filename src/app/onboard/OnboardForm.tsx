"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUser } from "./action";

export const onboardFormSchema = z.object({
	name: z.string().min(1),
});

async function onSubmit(values: z.infer<typeof onboardFormSchema>) {
	await createUser(values);
}

export default function OnboardForm() {
	const form = useForm<z.infer<typeof onboardFormSchema>>({
		resolver: zodResolver(onboardFormSchema),
		defaultValues: {
			name: "",
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-2"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input className="w-full" placeholder="Name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting && (
						<ReloadIcon className="mr-2 animate-spin" />
					)}
					Submit
				</Button>
			</form>
		</Form>
	);
}
