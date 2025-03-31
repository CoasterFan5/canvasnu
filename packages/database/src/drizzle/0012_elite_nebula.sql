ALTER TABLE "assignments" ADD COLUMN "domain" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "externalUrl" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "externalCompositeId" UNIQUE("ownerId","externalId","domain");