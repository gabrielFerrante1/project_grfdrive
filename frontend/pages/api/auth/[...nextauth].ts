import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from '../../../utils/api'
import { AuthUser, User } from "../../../types/AuthUser"; 
 
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            authorize: async (credentials, req) => { 
                if (credentials && credentials.email && credentials.password) {
                    const user: AuthUser = await api('auth/login', 'post', {
                        email: credentials.email,
                        password: credentials.password
                    })
               
                    if (user.error === '') {
                        return {
                            id: user.user.id,
                            name: user.user.name,
                            email: user.user.email,
                            jwt: user.access
                        }
                    }  
                }
                
                return null;
            },
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) token.user = user;
            return token
        },
        session: async ({ session, token }) => {
            if (token) session.user = token.user as User;
            return session
        }
    }, 
}

export default NextAuth(authOptions);