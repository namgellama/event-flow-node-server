CREATE TYPE "event_recipient_status" AS ENUM('PENDING', 'SENT', 'FAILED');--> statement-breakpoint
CREATE TABLE "event_recipients" (
	"event_id" uuid,
	"user_id" uuid,
	"provider_message_id" varchar(255) NOT NULL,
	"status" "event_recipient_status" DEFAULT 'PENDING'::"event_recipient_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_recipients_pkey" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "event_recipients" ADD CONSTRAINT "event_recipients_event_id_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_recipients" ADD CONSTRAINT "event_recipients_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;