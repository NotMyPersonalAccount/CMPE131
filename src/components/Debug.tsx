"use client";

import { deleteUser } from "@/lib/debug";

export default function Debug() {
	return <button onClick={() => deleteUser()}>Debug! Delete user info!</button>;
}
