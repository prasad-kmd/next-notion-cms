import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_build_only",
    baseURL: process.env.BETTER_AUTH_URL || process.env.SITE_URL || "http://localhost:3000",
    session: {
        // Use stateless JWT sessions to reduce database load on free tier
        strategy: "jwt",
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60, // 1 hour
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "google_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google_secret",
            enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "github_id",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "github_secret",
            enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID || "facebook_id",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "facebook_secret",
            enabled: !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
        },
        twitter: {
            clientId: process.env.TWITTER_CLIENT_ID || "twitter_id",
            clientSecret: process.env.TWITTER_CLIENT_SECRET || "twitter_secret",
            enabled: !!(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET),
        },
        reddit: {
            clientId: process.env.REDDIT_CLIENT_ID || "reddit_id",
            clientSecret: process.env.REDDIT_CLIENT_SECRET || "reddit_secret",
            enabled: !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET),
        },
    },
    // Future extensibility for account linking
    account: {
        accountLinking: {
            enabled: true,
        }
    },
    // Rate limiting to protect free tier
    rateLimit: {
        enabled: true,
        window: 60, // 60 seconds
        max: 50, // max 50 requests per window
    },
    // Trusted origins for security
    trustedOrigins: [process.env.SITE_URL || "http://localhost:3000"],
});
