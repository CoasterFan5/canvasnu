CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"externalId" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"nickname" varchar(256),
	"image" varchar(2048),
	"color" varchar(20),
	"hidden" boolean,
	"currentGrade" double precision
);
