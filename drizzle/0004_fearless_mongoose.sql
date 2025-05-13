CREATE TYPE "public"."topic_status" AS ENUM('progress', 'complete', 'fail');--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "status" "topic_status";