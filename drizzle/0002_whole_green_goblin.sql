CREATE TYPE "public"."page_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"type" varchar(40) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"config" jsonb NOT NULL,
	"template_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"version" integer NOT NULL,
	"label" varchar(160) DEFAULT '' NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_key" varchar(40),
	"managed" boolean DEFAULT true NOT NULL,
	"slug_it" varchar(160) NOT NULL,
	"slug_en" varchar(160) NOT NULL,
	"title" jsonb NOT NULL,
	"status" "page_status" DEFAULT 'draft' NOT NULL,
	"published_content" jsonb,
	"published_at" timestamp with time zone,
	"has_unpublished_changes" boolean DEFAULT true NOT NULL,
	"seo_title" jsonb NOT NULL,
	"seo_description" jsonb NOT NULL,
	"og_title" jsonb NOT NULL,
	"og_description" jsonb NOT NULL,
	"og_image_path" varchar(300) DEFAULT '' NOT NULL,
	"canonical_url" varchar(400) DEFAULT '' NOT NULL,
	"no_index" boolean DEFAULT false NOT NULL,
	"in_navigation" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" varchar(255) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "section_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"type" varchar(40) NOT NULL,
	"config" jsonb NOT NULL,
	"is_global" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_template_id_section_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."section_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_versions" ADD CONSTRAINT "page_versions_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "page_sections_page_idx" ON "page_sections" USING btree ("page_id","position");--> statement-breakpoint
CREATE INDEX "page_versions_page_idx" ON "page_versions" USING btree ("page_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "page_versions_unique_idx" ON "page_versions" USING btree ("page_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_slug_it_idx" ON "pages" USING btree ("slug_it");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_slug_en_idx" ON "pages" USING btree ("slug_en");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_route_key_idx" ON "pages" USING btree ("route_key");