import NextAuth from "next-auth/next";
import { User } from "./AuthUser";

declare module "next-auth" { 
    interface Session {
        user: User
    }
}