CREATE TABLE IF NOT EXISTS "user_time" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"time_spent" integer NOT NULL
);
