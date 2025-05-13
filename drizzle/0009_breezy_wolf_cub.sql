CREATE TYPE "public"."question_category" AS ENUM('Hazard Recognition', 'Knowledge', 'Insight');--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "question_category" "question_category";