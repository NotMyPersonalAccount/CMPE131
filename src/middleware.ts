import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextRequest, NextResponse } from "next/server";

const unauthenticatedRoutes = ["/api", "/_next"];
const onboardNotRequiredRoutes = ["/onboard"];

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	const pathname = req.nextUrl.pathname;
	if (pathname === "/") return res;

	for (const unauthenticatedRoute of unauthenticatedRoutes) {
		if (pathname.startsWith(unauthenticatedRoute)) return res;
	}
	const session = await getSession();
	if (!session)
		return NextResponse.redirect(new URL("/api/auth/login?returnTo=/browse", req.url), req);

	for (const onboardNotRequiredRoute of onboardNotRequiredRoutes) {
		if (pathname.startsWith(onboardNotRequiredRoute)) return res;
	}
	if (!session.data)
		return NextResponse.redirect(new URL("/onboard", req.url), req);

	return res;
}
