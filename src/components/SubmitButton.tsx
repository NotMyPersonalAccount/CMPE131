import { ReloadIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "./ui/button";

interface Props extends ButtonProps {
	submitting: boolean;
}

export default function SubmitButton({ submitting, ...props }: Props) {
	return (
		<Button type="submit" disabled={submitting} {...props}>
			{submitting && <ReloadIcon className="mr-2 animate-spin" />}
			Submit
		</Button>
	);
}
