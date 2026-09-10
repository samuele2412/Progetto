CREATE TYPE "public"."cocktail_category" AS ENUM('classics', 'fresh', 'signature', 'zero');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('new', 'contacted', 'quoted', 'confirmed', 'completed', 'lost');--> statement-breakpoint
CREATE TYPE "public"."service_mode" AS ENUM('full_service', 'bar_only', 'undecided');--> statement-breakpoint
CREATE TABLE "addons" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"name" jsonb NOT NULL,
	"description" jsonb NOT NULL,
	"price" jsonb NOT NULL,
	CONSTRAINT "addons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(120) DEFAULT '' NOT NULL,
	"password_hash" text NOT NULL,
	"session_version" integer DEFAULT 1 NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "cocktails" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"category" "cocktail_category" DEFAULT 'classics' NOT NULL,
	"name" varchar(120) NOT NULL,
	"ingredients" jsonb NOT NULL,
	"description" jsonb NOT NULL,
	"image_path" varchar(300) DEFAULT '' NOT NULL,
	CONSTRAINT "cocktails_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "event_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" varchar(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "request_status" DEFAULT 'new' NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"prefers_whatsapp" boolean DEFAULT true NOT NULL,
	"event_date" date,
	"date_flexible" boolean DEFAULT false NOT NULL,
	"event_type_slug" varchar(80) DEFAULT '' NOT NULL,
	"area" varchar(120) DEFAULT '' NOT NULL,
	"venue_note" varchar(200) DEFAULT '' NOT NULL,
	"guests_range" varchar(20) DEFAULT '' NOT NULL,
	"package_slug" varchar(80) DEFAULT '' NOT NULL,
	"service_mode" "service_mode" DEFAULT 'full_service' NOT NULL,
	"preferences" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"locale" varchar(5) DEFAULT 'it' NOT NULL,
	"consent_privacy" boolean DEFAULT false NOT NULL,
	"consent_privacy_at" timestamp with time zone,
	"source" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"admin_notes" text DEFAULT '' NOT NULL,
	"estimated_value" integer,
	"status_history" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ip_hash" varchar(64) DEFAULT '' NOT NULL,
	CONSTRAINT "event_requests_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "event_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"selectable" boolean DEFAULT true NOT NULL,
	"name" jsonb NOT NULL,
	"blurb" jsonb NOT NULL,
	"image_path" varchar(300) DEFAULT '' NOT NULL,
	CONSTRAINT "event_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"topic" varchar(60) DEFAULT 'general' NOT NULL,
	"question" jsonb NOT NULL,
	"answer" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"image_path" varchar(300) NOT NULL,
	"alt" jsonb NOT NULL,
	"caption" jsonb NOT NULL,
	"tag" varchar(60) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(80) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"in_navigation" boolean DEFAULT true NOT NULL,
	"slug_it" varchar(140) NOT NULL,
	"slug_en" varchar(140) NOT NULL,
	"hero_title" jsonb NOT NULL,
	"hero_subtitle" jsonb NOT NULL,
	"hero_image_path" varchar(300) DEFAULT '' NOT NULL,
	"body" jsonb NOT NULL,
	"highlights" jsonb NOT NULL,
	"seo_title" jsonb NOT NULL,
	"seo_description" jsonb NOT NULL,
	"recommended_package" varchar(80) DEFAULT '' NOT NULL,
	"event_type_slug" varchar(80) DEFAULT '' NOT NULL,
	"faq_topic" varchar(60) DEFAULT 'general' NOT NULL,
	CONSTRAINT "landing_pages_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"path" varchar(300) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(80) NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL,
	"alt" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"highlighted" boolean DEFAULT false NOT NULL,
	"name" jsonb NOT NULL,
	"kicker" jsonb NOT NULL,
	"description" jsonb NOT NULL,
	"guests_min" integer DEFAULT 0 NOT NULL,
	"guests_max" integer,
	"price_per_guest_from" integer DEFAULT 0 NOT NULL,
	"minimum_total" integer DEFAULT 0 NOT NULL,
	"price_note" jsonb NOT NULL,
	"includes" jsonb NOT NULL,
	"excludes" jsonb NOT NULL,
	"image_path" varchar(300) DEFAULT '' NOT NULL,
	CONSTRAINT "packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug_it" varchar(160) NOT NULL,
	"slug_en" varchar(160) NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" jsonb NOT NULL,
	"excerpt" jsonb NOT NULL,
	"body" jsonb NOT NULL,
	"cover_image_path" varchar(300) DEFAULT '' NOT NULL,
	"seo_title" jsonb NOT NULL,
	"seo_description" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(120) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"author_name" varchar(120) NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"event_label" jsonb NOT NULL,
	"quote" jsonb NOT NULL,
	"image_path" varchar(300) DEFAULT '' NOT NULL,
	"event_date" date
);
--> statement-breakpoint
CREATE INDEX "cocktails_category_idx" ON "cocktails" USING btree ("category");--> statement-breakpoint
CREATE INDEX "event_requests_status_idx" ON "event_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "event_requests_created_idx" ON "event_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "event_requests_event_date_idx" ON "event_requests" USING btree ("event_date");--> statement-breakpoint
CREATE UNIQUE INDEX "landing_slug_it_idx" ON "landing_pages" USING btree ("slug_it");--> statement-breakpoint
CREATE UNIQUE INDEX "landing_slug_en_idx" ON "landing_pages" USING btree ("slug_en");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_it_idx" ON "posts" USING btree ("slug_it");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_en_idx" ON "posts" USING btree ("slug_en");