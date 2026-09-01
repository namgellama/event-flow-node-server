ALTER TYPE "event_recipient_status" ADD VALUE 'SENDING' BEFORE 'SENT';--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "emailTemplateId" DROP NOT NULL;