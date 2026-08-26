CREATE TABLE "event_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"sender" varchar(255) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"html" text NOT NULL,
	"is_reusable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "emailTemplateId" uuid;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_emailTemplateId_event_templates_id_fkey" FOREIGN KEY ("emailTemplateId") REFERENCES "event_templates"("id");