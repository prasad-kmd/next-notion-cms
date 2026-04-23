CREATE TABLE "system_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service" text NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "system_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "service_created_at_idx" ON "system_logs" USING btree ("service","created_at");