ALTER TABLE "contacts" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "type" "contact_status" DEFAULT 'NEW' NOT NULL;