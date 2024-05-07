import { ReloadIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "./ui/button";

interface Props extends ButtonProps {
	text?: string;
	submitting: boolean;
}

export default function SubmitButton({ text, submitting, ...props }: Props) {
	return (
		<Button type="submit" disabled={submitting} {...props}>
			{submitting && <ReloadIcon className="mr-2 animate-spin" />}
			{text ?? "Submit"}
		</Button>
	);
}
