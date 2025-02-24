import { z } from 'zod';

const PlannerNoteSchema = z.object({
	id: z.number().describe('The ID of the planner note'),
	title: z.string().describe('The title for a planner note'),
	description: z.string().describe('The description of the planner note'),
	user_id: z.number().describe('The id of the associated user creating the planner note'),
	workflow_state: z
		.enum(['active', 'deleted'])
		.describe('The current published state of the planner note'),
	course_id: z
		.number()
		.nullable()
		.describe('The course that the note is in relation too, if applicable'),
	todo_date: z
		.string()
		.datetime()
		.describe('The datetime of when the planner note should show up on their planner'),
	linked_object_type: z.string().describe('the type of the linked learning object'),
	linked_object_id: z.number().describe('the id of the linked learning object'),
	linked_object_html_url: z
		.string()
		.url()
		.describe('the Canvas web URL of the linked learning object'),
	linked_object_url: z.string().url().describe('the API URL of the linked learning object')
});

const PlannerOverrideSchema = z.object({
	id: z.number().describe('The ID of the planner override'),
	plannable_type: z.string().describe('The type of the associated object for the planner override'),
	plannable_id: z.number().describe('The id of the associated object for the planner override'),
	user_id: z.number().describe('The id of the associated user for the planner override'),
	assignment_id: z
		.number()
		.nullable()
		.describe("The id of the plannable's associated assignment, if it has one"),
	workflow_state: z
		.enum(['published', 'active', 'deleted'])
		.describe('The current published state of the item, synced with the associated object'),
	marked_complete: z
		.boolean()
		.describe(
			'Controls whether or not the associated plannable item is marked complete on the planner'
		),
	dismissed: z
		.boolean()
		.describe(
			'Controls whether or not the associated plannable item shows up in the opportunities list'
		),
	created_at: z
		.string()
		.datetime()
		.describe('The datetime of when the planner override was created'),
	updated_at: z
		.string()
		.datetime()
		.describe('The datetime of when the planner override was updated'),
	deleted_at: z
		.string()
		.datetime()
		.nullable()
		.describe('The datetime of when the planner override was deleted, if applicable')
});

const SubmissionSchema = z.object({
	excused: z.boolean(),
	graded: z.boolean(),
	late: z.boolean(),
	missing: z.boolean(),
	needs_grading: z.boolean(),
	with_feedback: z.boolean().optional(),
	submitted: z.boolean().optional(),
	posted_at: z.string().datetime().nullable().optional(),
	has_feedback: z.boolean().optional(),
	redo_request: z.boolean().optional(),
	feedback: z
		.object({
			comment: z.string(),
			is_media: z.boolean(),
			author_name: z.string(),
			author_avatar_url: z.string().url()
		})
		.optional()
});

const PlannerItemSchema = z.object({
	context_type: z.string().optional(),
	course_id: z.number().optional(),
	planner_override: PlannerOverrideSchema.nullable(),
	submissions: z.union([SubmissionSchema, z.literal(false)]).optional(),
	plannable_id: z.number(),
	plannable_type: z.string(),
	plannable: z.union([
		z.record(z.any()), // Represents "discussion topic object" or "assignment object"
		PlannerNoteSchema
	]),
	html_url: z.string().optional()
});

const PlannerItemsResponseSchema = z.array(PlannerItemSchema);

export { PlannerNoteSchema, PlannerOverrideSchema, PlannerItemSchema, PlannerItemsResponseSchema };
