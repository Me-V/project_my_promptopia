import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@utils/database';
import User from '@models/user';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({ session }) {
            try {
                // Fetch user data from the database
                const sessionUser = await User.findOne({
                    email: session.user.email,
                });

                // Check if the user exists in the database
                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                }

                return session;
            } catch (error) {
                console.error('Error fetching user session:', error);
                throw error;
            }
        },

        async signIn({ profile }) {
            try {
                await connectToDB();

                // Check if the user already exists
                const userExists = await User.findOne({
                    email: profile.email
                });

                // If the user does not exist, create a new user and connect it to the database
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture
                    });
                }

                return true;
            } catch (error) {
                console.error('Error signing in:', error);
                return false;
            }
        }
    },
});

export { handler as GET, handler as POST };
