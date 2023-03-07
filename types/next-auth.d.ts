import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            data: {
                _id: string;
                shippers: [];
                roles: [];
                name: string;
                email_id: string;
                type: string;
                default_unit: string;
                role: string;
                accessToken: string;
                functions: [];
                mobile: string;
            }
        };
    }
}