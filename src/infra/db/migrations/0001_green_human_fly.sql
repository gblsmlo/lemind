ALTER TABLE "clients" ADD COLUMN "main_contact_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_main_contact_id_contacts_id_fk" FOREIGN KEY ("main_contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "email";
