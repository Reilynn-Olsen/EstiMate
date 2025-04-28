import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/quotes",
    "/quotes/:path*",
    "/quotes/new",
    "/clients",
    "/clients/:path*",
    "/settings",
  ],
};
