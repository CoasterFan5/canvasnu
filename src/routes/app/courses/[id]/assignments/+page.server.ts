import { db } from '$lib/server/db';
import { assignmentTable } from '$lib/server/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { logManager } from '$lib/server/logManager/logManager';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const load: PageServerLoad = async ({ parent }) => {
	logManager.log({
		type: 'info',
		message: 'Assignments load',
		alert: false
	});

	const parentData = await parent();
	const upComingAssignmentsPromise = db
		.select()
		.from(assignmentTable)
		.where(
			and(
				eq(assignmentTable.courseId, parentData.course.courseId),
				eq(assignmentTable.submitted, false),
				gt(assignmentTable.dueDate, new Date(Date.now() - SEVEN_DAYS))
			)
		);

	const allAssignmentsPromise = db
		.select()
		.from(assignmentTable)
		.where(eq(assignmentTable.courseId, parentData.course.courseId));

	const upComingAssignments = await upComingAssignmentsPromise;
	const allAssignments = await allAssignmentsPromise;

	return {
		upComingAssignments,
		allAssignments
	};
};
