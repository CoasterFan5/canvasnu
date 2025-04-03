import { z } from "zod";

const mediaCommentSchema = z.object({
  "content-type": z.string(),
  display_name: z.string(),
  media_id: z.string(),
  media_type: z.enum(["audio", "video"]),
  url: z.string().url(),
});

const submissionCommentSchema = z.object({
  id: z.number(),
  author_id: z.number(),
  author_name: z.string(),
  // author: z.record(z.any()), // Abbreviated user object - can be refined further if user API schema is available
  comment: z.string(),
  created_at: z.string().datetime(),
  edited_at: z.string().datetime().nullable(),
  media_comment: mediaCommentSchema.nullable(),
});

const submissionSchema = z.object({
  assignment_id: z.number(),
  assignment: z.any().nullable(), // See the assignments API
  course: z.any().nullable(), // See the course API
  attempt: z.number().nullable(),
  body: z.string().nullable(),
  grade: z.string().nullable().optional(),
  grade_matches_current_submission: z.boolean(),
  html_url: z.string().url().optional(),
  preview_url: z.string().url(),
  score: z.number().nullable().optional(),
  submission_comments: z.array(submissionCommentSchema).nullable().optional(),
  submission_type: z
    .enum([
      "online_text_entry",
      "online_url",
      "online_upload",
      "online_quiz",
      "media_recording",
      "student_annotation",
      "discussion_topic",
      "basic_lti_launch",
      "external_tool",
    ])
    .nullable(),
  submitted_at: z.string().datetime().nullable(),
  url: z.string().url().nullable(),
  user_id: z.number(),
  grader_id: z.number().nullable(),
  graded_at: z.string().datetime().nullable(),
  user: z.any().nullable(), // See user API
  late: z.boolean().nullable(),
  assignment_visible: z.boolean().optional(),
  excused: z.boolean().nullable(),
  missing: z.boolean().nullable(),
  late_policy_status: z
    .enum(["late", "missing", "extended", "none"])
    .nullable(),
  points_deducted: z.number().nullable(),
  seconds_late: z.number().nullable(),
  workflow_state: z
    .enum(["submitted", "unsubmitted", "graded", "pending_review"])
    .default("unsubmitted"), // Added 'pending_review' from the API response field description and set a default
  extra_attempts: z.number().nullable(),
  anonymous_id: z.string().nullable().optional(),
  posted_at: z.string().datetime().nullable(),
  read_status: z.enum(["read"]).nullable().optional(),
  redo_request: z.boolean(),
});

export type Submission = z.infer<typeof submissionSchema>;
export type MediaComment = z.infer<typeof mediaCommentSchema>;
export type SubmissionComment = z.infer<typeof submissionCommentSchema>;

export { submissionSchema, mediaCommentSchema, submissionCommentSchema };
