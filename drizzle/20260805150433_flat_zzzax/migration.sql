CREATE TYPE "event_status" AS ENUM('SCHEDULED', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'FAILED');--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"status" "event_status" DEFAULT 'SCHEDULED'::"event_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
