import {
	pgTable,
	serial,
	integer,
	date,
	varchar,
	boolean,
	doublePrecision,
	timestamp,
	unique
} from 'drizzle-orm/pg-core';

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
	permissions_limit_parent_app_web_access: boolean(),
	lastCourseSync: timestamp(),
	lastAssignmentSync: timestamp()
});

export const sessionTable = pgTable('session', {
	token: varchar({ length: 256 }).primaryKey(),
	userId: integer()
});

export const coursesTable = pgTable('courses', {
	courseId: serial('id').primaryKey(),
	ownerId: integer().notNull(),
	domain: varchar({ length: 256 }).notNull(),
	externalId: integer('externalId').notNull(),
	name: varchar({ length: 256 }).notNull(),
	nickname: varchar({ length: 256 }),
	image: varchar({ length: 2048 }),
	color: varchar({ length: 20 }),
	hidden: boolean(),
	currentGrade: doublePrecision()
});

export const assignmentTable = pgTable(
	'assignments',
	{
		assignmentId: serial('id').primaryKey(),
		ownerId: integer().notNull(),
		externalId: integer('externalId').notNull(),
		domain: varchar({ length: 256 }).notNull(),
		externalUrl: varchar({ length: 256 }),
		name: varchar({ length: 256 }).notNull(),
		courseId: integer(),
		externalCourseId: integer(),
		dueDate: timestamp(),
		grade: doublePrecision(),
		submitted: boolean()
	},
	(t) => [unique('externalCompositeId').on(t.ownerId, t.externalId, t.domain)]
);
