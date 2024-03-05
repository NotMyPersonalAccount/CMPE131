import prisma from "@/lib/prisma";
import {
	AppRouteHandlerFnContext,
	getSession,
	handleAuth,
	handleCallback,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export const GET = handleAuth({
	callback: async (req: NextRequest, ctx: AppRouteHandlerFnContext) => {
		const res = (await handleCallback(req, ctx)) as NextResponse;
		const session = (await getSession(req, res))!;
		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email,
			},
		});
		if (!user) {
			return NextResponse.redirect(process.env.AUTH0_BASE_URL + "/onboard", res);
		}
		return res;
	},
});
