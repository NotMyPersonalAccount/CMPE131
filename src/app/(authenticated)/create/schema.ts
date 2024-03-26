import { z } from "zod";

export const createFormSchema = z.object({
	title: z.string().min(3).max(64),
	description: z.string().min(0).max(128),
	content: z.string().min(20),
});
