ALTER TABLE "questions" ADD COLUMN "order" integer;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "order" integer;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();