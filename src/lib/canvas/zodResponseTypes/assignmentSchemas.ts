import { z } from 'zod';

const SectionGradingCountSchema = z.object({
	section_id: z.string(),
	needs_grading_count: z.number()
});

const TurnitinSettingsSchema = z.object({
	originality_report_visibility: z.enum(['immediate', 'after_grading', 'after_due_date', 'never']),
	exclude_small_matches_type: z.enum(['percent', 'words']).nullable(),
	exclude_small_matches_value: z.number().nullable()
});

const ExternalToolTagAttributesSchema = z.object({
	url: z.string(),
	new_tab: z.boolean().optional()
});

const RubricSettingsSchema = z.object({
	points_possible: z.string()
});

export const assignmentSchema = z.object({
	id: z.number().describe('the ID of the assignment'),
	name: z.string().describe('the name of the assignment'),
	description: z.string().describe('the assignment description, in an HTML fragment'),
	created_at: z.string().describe('The time at which this assignment was originally created'),
	updated_at: z.string().describe('The time at which this assignment was last modified in any way'),
	due_at: z
		.string()
		.nullable()
		.describe(
			'the due date for the assignment. returns null if not present. NOTE: If this assignment has assignment overrides, this field will be the due date as it applies to the user requesting information from the API.'
		),
	lock_at: z
		.string()
		.nullable()
		.describe(
			'the lock date (assignment is locked after this date). returns null if not present. NOTE: If this assignment has assignment overrides, this field will be the lock date as it applies to the user requesting information from the API.'
		),
	unlock_at: z
		.string()
		.nullable()
		.describe(
			'the unlock date (assignment is unlocked after this date) returns null if not present NOTE: If this assignment has assignment overrides, this field will be the unlock date as it applies to the user requesting information from the API.'
		),
	has_overrides: z.boolean().describe('whether this assignment has overrides'),
	all_dates: z
		.any()
		.nullable()
		.describe('(Optional) all dates associated with the assignment, if applicable'),
	course_id: z.number().describe('the ID of the course the assignment belongs to'),
	html_url: z.string().describe("the URL to the assignment's web page"),
	submissions_download_url: z.string().describe('the URL to download all submissions as a zip'),
	assignment_group_id: z.number().describe("the ID of the assignment's group"),
	due_date_required: z
		.boolean()
		.describe(
			'Boolean flag indicating whether the assignment requires a due date based on the account level setting'
		),
	allowed_extensions: z
		.array(z.string())
		.describe(
			"Allowed file extensions, which take effect if submission_types includes 'online_upload'."
		),
	max_name_length: z
		.number()
		.describe("An integer indicating the maximum length an assignment's name may be"),
	turnitin_enabled: z
		.boolean()
		.describe(
			'Boolean flag indicating whether or not Turnitin has been enabled for the assignment. NOTE: This flag will not appear unless your account has the Turnitin plugin available'
		),
	vericite_enabled: z
		.boolean()
		.describe(
			'Boolean flag indicating whether or not VeriCite has been enabled for the assignment. NOTE: This flag will not appear unless your account has the VeriCite plugin available'
		),
	turnitin_settings: TurnitinSettingsSchema.nullable().describe(
		"Settings to pass along to turnitin to control what kinds of matches should be considered. originality_report_visibility can be 'immediate', 'after_grading', 'after_due_date', or 'never' exclude_small_matches_type can be null, 'percent', 'words' exclude_small_matches_value: - if type is null, this will be null also - if type is 'percent', this will be a number between 0 and 100 representing match size to exclude as a percentage of the document size. - if type is 'words', this will be number > 0 representing how many words a match must contain for it to be considered NOTE: This flag will not appear unless your account has the Turnitin plugin available"
	),
	grade_group_students_individually: z
		.boolean()
		.describe(
			'If this is a group assignment, boolean flag indicating whether or not students will be graded individually.'
		),
	external_tool_tag_attributes: ExternalToolTagAttributesSchema.nullable().describe(
		"(Optional) assignment's settings for external tools if submission_types include 'external_tool'. Only url and new_tab are included (new_tab defaults to false).  Use the 'External Tools' API if you need more information about an external tool."
	),
	peer_reviews: z
		.boolean()
		.describe('Boolean indicating if peer reviews are required for this assignment'),
	automatic_peer_reviews: z
		.boolean()
		.describe(
			'Boolean indicating peer reviews are assigned automatically. If false, the teacher is expected to manually assign peer reviews.'
		),
	peer_review_count: z
		.number()
		.optional()
		.describe(
			'Integer representing the amount of reviews each user is assigned. NOTE: This key is NOT present unless you have automatic_peer_reviews set to true.'
		),
	peer_reviews_assign_at: z
		.string()
		.optional()
		.describe(
			"String representing a date the reviews are due by. Must be a date that occurs after the default due date. If blank, or date is not after the assignment's due date, the assignment's due date will be used. NOTE: This key is NOT present unless you have automatic_peer_reviews set to true."
		),
	intra_group_peer_reviews: z
		.boolean()
		.describe(
			"Boolean representing whether or not members from within the same group on a group assignment can be assigned to peer review their own group's work"
		),
	group_category_id: z
		.number()
		.describe(
			'The ID of the assignment’s group set, if this is a group assignment. For group discussions, set group_category_id on the discussion topic, not the linked assignment.'
		),
	needs_grading_count: z
		.number()
		.describe(
			'if the requesting user has grading rights, the number of submissions that need grading.'
		),
	needs_grading_count_by_section: z
		.array(SectionGradingCountSchema)
		.optional()
		.describe(
			"if the requesting user has grading rights and the 'needs_grading_count_by_section' flag is specified, the number of submissions that need grading split out by section. NOTE: This key is NOT present unless you pass the 'needs_grading_count_by_section' argument as true.  ANOTHER NOTE: it's possible to be enrolled in multiple sections, and if a student is setup that way they will show an assignment that needs grading in multiple sections (effectively the count will be duplicated between sections)"
		),
	position: z.number().describe('the sorting order of the assignment in the group'),
	post_to_sis: z
		.boolean()
		.optional()
		.describe('(optional, present if Sync Grades to SIS feature is enabled)'),
	integration_id: z
		.string()
		.optional()
		.describe('(optional, Third Party unique identifier for Assignment)'),
	integration_data: z
		.record(z.string())
		.optional()
		.describe('(optional, Third Party integration data for assignment)'),
	points_possible: z.number().describe('the maximum points possible for the assignment'),
	submission_types: z
		.array(
			z.enum([
				'discussion_topic',
				'online_quiz',
				'on_paper',
				'none',
				'external_tool',
				'online_text_entry',
				'online_url',
				'online_upload',
				'media_recording',
				'student_annotation'
			])
		)
		.describe(
			"the types of submissions allowed for this assignment list containing one or more of the following: 'discussion_topic', 'online_quiz', 'on_paper', 'none', 'external_tool', 'online_text_entry', 'online_url', 'online_upload', 'media_recording', 'student_annotation'"
		),
	has_submitted_submissions: z
		.boolean()
		.describe('If true, the assignment has been submitted to by at least one student'),
	grading_type: z
		.enum(['pass_fail', 'percent', 'letter_grade', 'gpa_scale', 'points'])
		.describe(
			"The type of grading the assignment receives; one of 'pass_fail', 'percent', 'letter_grade', 'gpa_scale', 'points'"
		),
	grading_standard_id: z
		.number()
		.nullable()
		.describe(
			"The id of the grading standard being applied to this assignment. Valid if grading_type is 'letter_grade' or 'gpa_scale'."
		),
	published: z.boolean().describe('Whether the assignment is published'),
	unpublishable: z
		.boolean()
		.describe(
			"Whether the assignment's 'published' state can be changed to false. Will be false if there are student submissions for the assignment."
		),
	only_visible_to_overrides: z
		.boolean()
		.describe('Whether the assignment is only visible to overrides.'),
	locked_for_user: z.boolean().describe('Whether or not this is locked for the user.'),
	lock_info: z
		.any()
		.nullable()
		.describe(
			'(Optional) Information for the user about the lock. Present when locked_for_user is true.'
		),
	lock_explanation: z
		.string()
		.optional()
		.describe(
			'(Optional) An explanation of why this is locked for the user. Present when locked_for_user is true.'
		),
	quiz_id: z
		.number()
		.optional()
		.describe(
			"(Optional) id of the associated quiz (applies only when submission_types is ['online_quiz'])"
		),
	anonymous_submissions: z
		.boolean()
		.optional()
		.describe(
			'(Optional) whether anonymous submissions are accepted (applies only to quiz assignments)'
		),
	discussion_topic: z
		.any()
		.nullable()
		.describe('(Optional) the DiscussionTopic associated with the assignment, if applicable'),
	freeze_on_copy: z
		.boolean()
		.optional()
		.describe(
			'(Optional) Boolean indicating if assignment will be frozen when it is copied. NOTE: This field will only be present if the AssignmentFreezer plugin is available for your account.'
		),
	frozen: z
		.boolean()
		.optional()
		.describe(
			'(Optional) Boolean indicating if assignment is frozen for the calling user. NOTE: This field will only be present if the AssignmentFreezer plugin is available for your account.'
		),
	frozen_attributes: z
		.array(
			z.enum([
				'title',
				'description',
				'lock_at',
				'points_possible',
				'grading_type',
				'submission_types',
				'assignment_group_id',
				'allowed_extensions',
				'group_category_id',
				'notify_of_update',
				'peer_reviews'
			])
		)
		.optional()
		.describe(
			'(Optional) Array of frozen attributes for the assignment. Only account administrators currently have permission to change an attribute in this list. Will be empty if no attributes are frozen for this assignment. Possible frozen attributes are: title, description, lock_at, points_possible, grading_type, submission_types, assignment_group_id, allowed_extensions, group_category_id, notify_of_update, peer_reviews NOTE: This field will only be present if the AssignmentFreezer plugin is available for your account.'
		),
	submission: z
		.any()
		.nullable()
		.describe(
			"(Optional) If 'submission' is included in the 'include' parameter, includes a Submission object that represents the current user's (user who is requesting information from the api) current submission for the assignment. See the Submissions API for an example response. If the user does not have a submission, this key will be absent."
		),
	use_rubric_for_grading: z
		.boolean()
		.optional()
		.describe(
			'(Optional) If true, the rubric is directly tied to grading the assignment. Otherwise, it is only advisory. Included if there is an associated rubric.'
		),
	rubric_settings: RubricSettingsSchema.optional().describe(
		'(Optional) An object describing the basic attributes of the rubric, including the point total. Included if there is an associated rubric.'
	),
	rubric: z
		.any()
		.nullable()
		.describe(
			'(Optional) A list of scoring criteria and ratings for each rubric criterion. Included if there is an associated rubric.'
		),
	assignment_visibility: z
		.array(z.number())
		.optional()
		.describe(
			"(Optional) If 'assignment_visibility' is included in the 'include' parameter, includes an array of student IDs who can see this assignment."
		),
	overrides: z
		.any()
		.nullable()
		.describe(
			"(Optional) If 'overrides' is included in the 'include' parameter, includes an array of assignment override objects."
		),
	omit_from_final_grade: z
		.boolean()
		.optional()
		.describe("(Optional) If true, the assignment will be omitted from the student's final grade"),
	hide_in_gradebook: z
		.boolean()
		.optional()
		.describe('(Optional) If true, the assignment will not be shown in any gradebooks'),
	moderated_grading: z.boolean().describe('Boolean indicating if the assignment is moderated.'),
	grader_count: z
		.number()
		.describe(
			'The maximum number of provisional graders who may issue grades for this assignment. Only relevant for moderated assignments. Must be a positive value, and must be set to 1 if the course has fewer than two active instructors. Otherwise, the maximum value is the number of active instructors in the course minus one, or 10 if the course has more than 11 active instructors.'
		),
	final_grader_id: z
		.number()
		.describe(
			'The user ID of the grader responsible for choosing final grades for this assignment. Only relevant for moderated assignments.'
		),
	grader_comments_visible_to_graders: z
		.boolean()
		.describe(
			"Boolean indicating if provisional graders' comments are visible to other provisional graders. Only relevant for moderated assignments."
		),
	graders_anonymous_to_graders: z
		.boolean()
		.describe(
			"Boolean indicating if provisional graders' identities are hidden from other provisional graders. Only relevant for moderated assignments with grader_comments_visible_to_graders set to true."
		),
	grader_names_visible_to_final_grader: z
		.boolean()
		.describe(
			'Boolean indicating if provisional grader identities are visible to the final grader. Only relevant for moderated assignments.'
		),
	anonymous_grading: z
		.boolean()
		.describe(
			'Boolean indicating if the assignment is graded anonymously. If true, graders cannot see student identities.'
		),
	allowed_attempts: z
		.number()
		.describe(
			'The number of submission attempts a student can make for this assignment. -1 is considered unlimited.'
		),
	post_manually: z
		.boolean()
		.describe(
			'Whether the assignment has manual posting enabled. Only relevant for courses using New Gradebook.'
		),
	score_statistics: z
		.any()
		.nullable()
		.describe(
			"(Optional) If 'score_statistics' and 'submission' are included in the 'include' parameter and statistics are available, includes the min, max, and mode for this assignment"
		),
	can_submit: z
		.boolean()
		.optional()
		.describe(
			"(Optional) If retrieving a single assignment and 'can_submit' is included in the 'include' parameter, flags whether user has the right to submit the assignment (i.e. checks enrollment dates, submission types, locked status, attempts remaining, etc...). Including 'can submit' automatically includes 'submission' in the include parameter. Not available when observed_users are included."
		),
	ab_guid: z
		.array(z.string())
		.optional()
		.describe(
			"(Optional) The academic benchmark(s) associated with the assignment or the assignment's rubric. Only included if 'ab_guid' is included in the 'include' parameter."
		),
	annotatable_attachment_id: z
		.number()
		.nullable()
		.describe(
			"The id of the attachment to be annotated by students. Relevant only if submission_types includes 'student_annotation'."
		),
	anonymize_students: z
		.boolean()
		.optional()
		.describe('(Optional) Boolean indicating whether student names are anonymized'),
	require_lockdown_browser: z
		.boolean()
		.optional()
		.describe(
			'(Optional) Boolean indicating whether the Respondus LockDown Browser® is required for this assignment.'
		),
	important_dates: z
		.boolean()
		.optional()
		.describe('(Optional) Boolean indicating whether this assignment has important dates.'),
	muted: z
		.boolean()
		.optional()
		.describe(
			'(Optional, Deprecated) Boolean indicating whether notifications are muted for this assignment.'
		),
	anonymous_peer_reviews: z
		.boolean()
		.describe('Boolean indicating whether peer reviews are anonymous.'),
	anonymous_instructor_annotations: z
		.boolean()
		.describe('Boolean indicating whether instructor anotations are anonymous.'),
	graded_submissions_exist: z
		.boolean()
		.describe('Boolean indicating whether this assignment has graded submissions.'),
	is_quiz_assignment: z
		.boolean()
		.describe('Boolean indicating whether this is a quiz lti assignment.'),
	in_closed_grading_period: z
		.boolean()
		.describe('Boolean indicating whether this assignment is in a closed grading period.'),
	can_duplicate: z
		.boolean()
		.describe('Boolean indicating whether this assignment can be duplicated.'),
	original_course_id: z
		.number()
		.describe("If this assignment is a duplicate, it is the original assignment's course_id"),
	original_assignment_id: z
		.number()
		.describe("If this assignment is a duplicate, it is the original assignment's id"),
	original_lti_resource_link_id: z
		.number()
		.describe(
			"If this assignment is a duplicate, it is the original assignment's lti_resource_link_id"
		),
	original_assignment_name: z
		.string()
		.describe("If this assignment is a duplicate, it is the original assignment's name"),
	original_quiz_id: z
		.number()
		.describe("If this assignment is a duplicate, it is the original assignment's quiz_id"),
	workflow_state: z
		.enum(['unpublished', 'published', 'deleted'])
		.describe('String indicating what state this assignment is in.')
});
