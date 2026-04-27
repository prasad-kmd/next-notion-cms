import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Use connection pooling for Supabase if needed, but postgres-js handles this well
// For free tier, we should be careful with the number of connections.
export const client = postgres(connectionString, {
  prepare: false, // Recommended for some connection poolers
  max: 1, // Adjust based on Supabase free tier limits (usually 20-50 total)
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout
});

export const db = drizzle(client, { schema });
