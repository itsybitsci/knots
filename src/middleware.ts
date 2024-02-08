import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	ignoredRoutes: [
		'/api/webhook/clerk',
		'/api/uploadthing',
	],
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};