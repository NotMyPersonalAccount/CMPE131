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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUser } from "./action";
import { onboardFormSchema } from "./schema";
import SubmitButton from "@/components/SubmitButton";

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
				<SubmitButton submitting={form.formState.isSubmitting} />
			</form>
		</Form>
	);
}
