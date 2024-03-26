"use client";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createFormSchema } from "./schema";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import { createRecipe } from "./action";

async function onSubmit(values: z.infer<typeof createFormSchema>) {
	await createRecipe(values);
}

export default function CreateForm() {
	const form = useForm<z.infer<typeof createFormSchema>>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			title: "",
			description: "",
			content: "",
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
					name="title"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input className="w-full" placeholder="Title" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Input
										className="w-full"
										placeholder="Description"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									A short description of your recipe, 128 words max
								</FormDescription>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Recipe</FormLabel>
								<FormControl>
									<Textarea {...field} />
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
