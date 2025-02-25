/*
{
    "id": 2022640,
    "name": "1st-Semester Enrollment Modules for First Year Students - Summer 2024",
    "account_id": 81707,
    "uuid": "58QZ245VM29Gt2OhpzNpEcSwWtFC4mKbF4RQcFZP",
    "start_at": null,
    "grading_standard_id": null,
    "is_public": false,
    "created_at": "2024-02-29T13:49:56Z",
    "course_code": "1st-Semester Enrollment Modules for First Year Students - Summer 2024",
    "default_view": "wiki",
    "root_account_id": 81707,
    "enrollment_term_id": 233,
    "license": "private",
    "grade_passback_setting": null,
    "end_at": null,
    "public_syllabus": false,
    "public_syllabus_to_auth": false,
    "storage_quota_mb": 15728640,
    "is_public_to_auth_users": false,
    "homeroom_course": false,
    "course_color": null,
    "friendly_name": null,
    "apply_assignment_group_weights": false,
    "calendar": {
      "ics": "https://canvas.jmu.edu/feeds/calendars/course_58QZ245VM29Gt2OhpzNpEcSwWtFC4mKbF4RQcFZP.ics"
    },
    "time_zone": "America/New_York",
    "blueprint": false,
    "template": false,
    "enrollments": [
      {
        "type": "student",
        "role": "StudentEnrollment",
        "role_id": 3373,
        "user_id": 6060060,
        "enrollment_state": "active",
        "limit_privileges_to_course_section": false,
        "computed_current_grade": null,
        "computed_current_score": null,
        "computed_current_letter_grade": null,
        "computed_final_grade": null,
        "computed_final_score": null
      }
    ],
    "hide_final_grades": false,
    "workflow_state": "available",
    "restrict_enrollments_to_course_dates": false
  },*/

import { z } from 'zod';

export const courseEnrollmentWthGradeObject = z.object({
	type: z.string(),
	role: z.string(),
	role_id: z.number(),
	user_id: z.number(),
	enrollment_state: z.string(),
	limit_privileges_to_course_section: z.boolean(),
	computed_current_grade: z.string().nullable().optional(),
	computed_current_score: z.number().nullable().optional(),
	computed_current_letter_grade: z.string().nullable().optional(),
	computed_final_grade: z.string().nullable().optional(),
	computed_final_score: z.number().nullable().optional()
});

export const courseWithGradesObject = z.object({
	id: z.number(),
	name: z.string(),
	account_id: z.number(),
	uuid: z.string(),
	is_public: z.boolean().nullable(),
	start_at: z.coerce.date().nullable().optional(),
	created_at: z.coerce.date(),
	course_code: z.string(),
	default_view: z.string(),
	root_account_id: z.number(),
	enrollment_term_id: z.number(),
	license: z.string().nullable(),
	grade_passback_setting: z.string().optional().nullable(),
	end_at: z.coerce.date().nullable().optional(),
	public_syllabus: z.boolean(),
	public_syllabus_to_auth: z.boolean(),
	storage_quota_mb: z.number(),
	is_public_to_auth_users: z.boolean(),
	homeroom_course: z.boolean(),
	course_color: z.string().nullable().optional(),
	friendly_name: z.string().nullable().optional(),
	apply_assignment_group_weights: z.boolean(),
	calendar: z.object({
		ics: z.string()
	}),
	time_zone: z.string(),
	blueprint: z.boolean(),
	template: z.boolean(),
	enrollments: z.array(courseEnrollmentWthGradeObject),
	image_download_url: z.string().optional().nullable(),
	hide_final_grades: z.boolean(),
	workflow_state: z.string(),
	restrict_enrollments_to_course_dates: z.boolean()
});

export const courseListWithGradesObject = z.array(courseWithGradesObject);
