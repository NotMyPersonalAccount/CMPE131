import { z } from "zod";

export const onboardFormSchema = z.object({
	name: z.string().min(1),
});