ALTER TABLE "assignments" ADD COLUMN "externalCourseId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "dueDate" timestamp;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "grade" double precision;