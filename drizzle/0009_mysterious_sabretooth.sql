CREATE TABLE "assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"ownerId" integer NOT NULL,
	"externalId" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"courseId" integer NOT NULL
);
