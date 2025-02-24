import { pgTable, serial, integer, date, varchar, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	canvas_id: integer('canvasId').notNull(),
	canvas_domain: varchar({ length: 256 }).notNull(),
	access_token: varchar({ length: 1028 }).notNull(),
	createdAt: date(),
	lastName: varchar({ length: 256 }).notNull(),
	firstName: varchar({ length: 256 }).notNull(),
	pronouns: varchar({ length: 100 }),
	locale: varchar({ length: 5 }),
	effective_local: varchar({ length: 5 }),
	avatar_url: varchar({ length: 2048 }),
	permissions_can_update_name: boolean(),
	permissions_can_update_avatar: boolean(),
	permissions_limit_parent_app_web_access: boolean()
});

export const sessionTable = pgTable('session', {
	token: varchar({ length: 256 }).primaryKey(),
	userId: integer()
});
