import { getFullPlannerFeed } from '$lib/canvas/functions/getFullPlannerFeed';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { assignmentTable, coursesTable, user } from '../db/schema';
import crypto from 'crypto';

export const syncPlanner = async (dbUser: typeof user.$inferSelect) => {
	console.log(`Syncing planner`);

	const courseDataPormise = db
		.select()
		.from(coursesTable)
		.where(eq(coursesTable.ownerId, dbUser.id));
	const fullPlannerDataPromise = getFullPlannerFeed(dbUser.canvas_domain, dbUser.access_token);

	const courseData = await courseDataPormise;
	const externalCourseIdToInterlaIdMap: {
		[key: number]: number;
	} = {};

	for (const course of courseData) {
		externalCourseIdToInterlaIdMap[course.externalId] = course.courseId;
	}

	const fullPlannerData = await fullPlannerDataPromise;

	const queries = [];

	if (!fullPlannerData) {
		return false;
	}

	for (const plannerItem of fullPlannerData) {
		if (plannerItem.plannable.due_at) {
			const isSubmitted = plannerItem.submissions
				? plannerItem.submissions.submitted ||
					plannerItem.submissions.graded ||
					plannerItem.submissions.graded ||
					plannerItem.planner_override
					? true
					: false
				: false;

			queries.push(
				db
					.insert(assignmentTable)
					.values({
						name: plannerItem.plannable.title,
						ownerId: dbUser.id,
						domain: dbUser.canvas_domain,
						externalUrl: plannerItem.html_url,
						externalId: plannerItem.plannable_id,
						courseId: externalCourseIdToInterlaIdMap[plannerItem.plannable.course_id] || undefined,
						externalCourseId: plannerItem.plannable.course_id,
						dueDate: new Date(plannerItem.plannable.due_at),
						submitted: isSubmitted,
						grade: 0
					})
					.onConflictDoUpdate({
						target: [assignmentTable.ownerId, assignmentTable.externalId, assignmentTable.domain],
						set: {
							grade: 0,
							dueDate: new Date(plannerItem.plannable.due_at),
							submitted: isSubmitted
						}
					})
			);
		}
	}

	const userUpdate = db
		.update(user)
		.set({
			lastAssignmentSync: new Date()
		})
		.where(eq(user.id, dbUser.id));

	await Promise.all(queries);
	await userUpdate;

	return true;
};
