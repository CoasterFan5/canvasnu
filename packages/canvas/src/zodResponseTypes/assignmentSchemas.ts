import { z } from "zod";

const ExternalToolTagAttributesSchema = z
  .object({
    url: z.string(),
    new_tab: z.boolean().optional(),
    resource_link_id: z.string(),
  })
  .optional()
  .nullable(); // Make optional and nullable

const LockInfoSchema = z
  .object({
    asset_string: z.string(),
    unlock_at: z.string().datetime().optional().nullable(),
    lock_at: z.string().datetime().optional().nullable(),
    context_module: z.any().optional(),
    manually_locked: z.boolean().optional(),
  })
  .optional();

const RubricRatingSchema = z.object({
  points: z.number(),
  id: z.string(),
  description: z.string(),
  long_description: z.string(),
});

const RubricCriteriaSchema = z.object({
  points: z.number(),
  id: z.string(),
  learning_outcome_id: z.string().optional().nullable(),
  vendor_guid: z.string().optional().nullable(),
  description: z.string(),
  long_description: z.string().optional(),
  criterion_use_range: z.boolean().optional(),
  ratings: z.array(RubricRatingSchema).nullable().optional(),
  ignore_for_scoring: z.boolean().optional(),
});

const AssignmentDateSchema = z.object({
  id: z.number().optional(),
  base: z.boolean().optional(),
  title: z.string(),
  due_at: z.string().datetime().optional().nullable(),
  unlock_at: z.string().datetime().optional().nullable(),
  lock_at: z.string().datetime().optional().nullable(),
});

const TurnitinSettingsSchema = z
  .object({
    originality_report_visibility: z
      .enum(["immediate", "after_grading", "after_due_date", "never"])
      .optional(),
    s_paper_check: z.boolean().optional(),
    internet_check: z.boolean().optional(),
    journal_check: z.boolean().optional(),
    exclude_biblio: z.boolean().optional(),
    exclude_quoted: z.boolean().optional(),
    exclude_small_matches_type: z
      .enum(["percent", "words"])
      .optional()
      .nullable(),
    exclude_small_matches_value: z.number().optional().nullable(),
  })
  .optional()
  .nullable();

const NeedsGradingCountSchema = z.object({
  section_id: z.string(),
  needs_grading_count: z.number(),
});

const ScoreStatisticSchema = z
  .object({
    min: z.number(),
    max: z.number(),
    mean: z.number(),
    upper_q: z.number(),
    median: z.number(),
    lower_q: z.number(),
  })
  .optional()
  .nullable();

export const AssignmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(), // Make nullable
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  due_at: z.string().datetime().optional().nullable(),
  lock_at: z.string().datetime().optional().nullable(),
  unlock_at: z.string().datetime().optional().nullable(),
  has_overrides: z.boolean().optional(), // Make optional
  all_dates: z.array(AssignmentDateSchema).optional().nullable(),
  course_id: z.number(),
  html_url: z.string().url(),
  submissions_download_url: z.string().url(),
  assignment_group_id: z.number(),
  due_date_required: z.boolean(),
  allowed_extensions: z.array(z.string()).optional(), // Already optional
  max_name_length: z.number(),
  turnitin_enabled: z.boolean().optional(), // Already optional
  vericite_enabled: z.boolean().optional(), // Already optional
  turnitin_settings: TurnitinSettingsSchema, // Already optional and nullable
  grade_group_students_individually: z.boolean(),
  external_tool_tag_attributes: ExternalToolTagAttributesSchema, // Already optional and nullable
  peer_reviews: z.boolean(),
  automatic_peer_reviews: z.boolean(),
  peer_review_count: z.number().optional(),
  peer_reviews_assign_at: z.string().datetime().optional().nullable(),
  intra_group_peer_reviews: z.boolean(),
  group_category_id: z.number().optional().nullable(), // Already optional and nullable
  needs_grading_count: z.number().optional(), // Already optional
  needs_grading_count_by_section: z
    .array(NeedsGradingCountSchema)
    .optional()
    .nullable(),
  position: z.number(),
  post_to_sis: z.boolean().optional(),
  integration_id: z.string().optional().nullable(),
  integration_data: z.record(z.string(), z.any()).optional(),
  points_possible: z.number().nullable().optional(),
  submission_types: z.array(
    z.enum([
      "not_graded",
      "discussion_topic",
      "online_quiz",
      "on_paper",
      "none",
      "external_tool",
      "online_text_entry",
      "online_url",
      "online_upload",
      "media_recording",
      "student_annotation",
    ]),
  ),
  has_submitted_submissions: z.boolean(),
  grading_type: z.enum([
    "not_graded",
    "pass_fail",
    "percent",
    "letter_grade",
    "gpa_scale",
    "points",
  ]),
  grading_standard_id: z.number().optional().nullable(),
  published: z.boolean(),
  unpublishable: z.boolean().optional(), // Make optional
  only_visible_to_overrides: z.boolean(),
  locked_for_user: z.boolean(),
  lock_info: LockInfoSchema,
  lock_explanation: z.string().optional().nullable(),
  quiz_id: z.number().optional().nullable(),
  anonymous_submissions: z.boolean().optional(),
  discussion_topic: z.any().optional().nullable(),
  freeze_on_copy: z.boolean().optional(),
  frozen: z.boolean().optional(),
  frozen_attributes: z
    .array(
      z.enum([
        "title",
        "description",
        "lock_at",
        "points_possible",
        "grading_type",
        "submission_types",
        "assignment_group_id",
        "allowed_extensions",
        "group_category_id",
        "notify_of_update",
        "peer_reviews",
      ]),
    )
    .optional(),
  submission: z.any().optional().nullable(),
  use_rubric_for_grading: z.boolean().optional(),
  rubric_settings: z
    .object({ points_possible: z.number().optional().nullable() })
    .optional()
    .nullable(),
  rubric: z.array(RubricCriteriaSchema).optional().nullable(),
  assignment_visibility: z.array(z.number()).optional(),
  overrides: z.array(z.any()).optional().nullable(),
  omit_from_final_grade: z.boolean().optional(),
  hide_in_gradebook: z.boolean().optional(),
  moderated_grading: z.boolean().optional(),
  grader_count: z.number().optional(),
  final_grader_id: z.number().optional().nullable(), // Already optional and nullable
  grader_comments_visible_to_graders: z.boolean().optional(),
  graders_anonymous_to_graders: z.boolean().optional(),
  grader_names_visible_to_final_grader: z.boolean().optional(),
  anonymous_grading: z.boolean().optional(),
  allowed_attempts: z.number().optional(),
  post_manually: z.boolean().optional(),
  score_statistics: ScoreStatisticSchema,
  can_submit: z.boolean().optional(),
  ab_guid: z.array(z.string()).optional(),
  annotatable_attachment_id: z.number().optional().nullable(),
  anonymize_students: z.boolean().optional(),
  require_lockdown_browser: z.boolean().optional(),
  important_dates: z.boolean().optional(),
  muted: z.boolean().optional(),
  anonymous_peer_reviews: z.boolean().optional(),
  anonymous_instructor_annotations: z.boolean().optional(),
  graded_submissions_exist: z.boolean().optional(),
  is_quiz_assignment: z.boolean().optional(),
  in_closed_grading_period: z.boolean().optional(),
  can_duplicate: z.boolean().optional(),
  original_course_id: z.number().optional().nullable(),
  original_assignment_id: z.number().optional().nullable(),
  original_lti_resource_link_id: z.string().optional().nullable(),
  original_assignment_name: z.string().optional().nullable(),
  original_quiz_id: z.number().optional().nullable(),
  workflow_state: z.enum(["unpublished", "published"]).optional(),
});
