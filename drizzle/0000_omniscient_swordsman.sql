CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"canvasId" integer NOT NULL,
	"canvas_domain" varchar(256),
	"createdAt" date,
	"lastName" varchar(256) NOT NULL,
	"firstName" varchar(256) NOT NULL,
	"pronouns" varchar(100) NOT NULL,
	"locale" varchar(5),
	"effective_local" varchar(5),
	"avatar_url" varchar(2048),
	"permissions_can_update_name" boolean,
	"permissions_can_update_avatar" boolean,
	"permissions_limit_parent_app_web_access" boolean
);
