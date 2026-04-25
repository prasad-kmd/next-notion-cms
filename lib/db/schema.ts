import { pgTable, text, timestamp, boolean, jsonb, uuid, index } from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	role: text("role").notNull().default("user"),
    // Added for future extensibility and localstorage sync
    preferences: jsonb("preferences").default({}),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

export const systemLogs = pgTable("system_logs", {
	id: uuid("id").primaryKey().defaultRandom(),
	service: text("service").notNull(), // 'notion', 'supabase', 'posthog', 'system'
	level: text("level").notNull(), // 'info', 'warning', 'error'
	message: text("message").notNull(),
	metadata: jsonb("metadata").default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => {
	return {
		createdAtIndex: index("created_at_idx").on(table.createdAt),
		serviceCreatedAtIndex: index("service_created_at_idx").on(table.service, table.createdAt),
	};
});
