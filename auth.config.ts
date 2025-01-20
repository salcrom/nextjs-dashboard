import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';


export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks:{
        authorized({ auth, request: { nextUrl } }){
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if(isOnDashboard){
                if(isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [
        Credentials({
            // Configuración del provider
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials){
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    if(credentials.email === "user@example.com" && credentials.password === 'password'){
                        return {
                            id: '1',
                            email: credentials.email,
                            name: 'User',
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('Error en autenticación', error);
                    return null;
                }
            }
        })
    ], // Add providers with an empty array for now
} satisfies NextAuthConfig;
