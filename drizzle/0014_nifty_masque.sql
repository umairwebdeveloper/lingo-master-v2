ALTER TYPE "public"."question_type" ADD VALUE 'multiple-choice-with-image';--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "image_options" jsonb DEFAULT '[]'::jsonb;