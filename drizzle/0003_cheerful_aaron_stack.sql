ALTER TABLE "media_assets" ADD COLUMN "is_temporary" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "media_assets" ADD COLUMN "source_note" varchar(300) DEFAULT '' NOT NULL;