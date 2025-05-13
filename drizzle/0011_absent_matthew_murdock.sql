ALTER TABLE "courses" ALTER COLUMN "image_src" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "video_chapters" ALTER COLUMN "order" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "order" DROP NOT NULL;