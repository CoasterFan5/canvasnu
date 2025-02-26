import { validateSession } from '$lib/server/validateSession';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { syncCourseData } from '$lib/server/dataManagers/syncCourseData';
import { actionHelper } from '$lib/server/actionHelper';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { assignmentTable, coursesTable } from '$lib/server/db/schema';
import { and, asc, eq, isNull, or } from 'drizzle-orm';
import { syncPlanner } from '$lib/server/dataManagers/syncPlanner';

const TEN_MINUTES = 10 * 60 * 1000;

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies.get('session'));

	if (!user) {
		throw redirect(307, '/onboarding');
	}

	const courses = syncCourseData(user);

	if (!user.lastAssignmentSync || user.lastAssignmentSync?.getTime() < Date.now() - TEN_MINUTES) {
		await syncPlanner(user);
	}

	const assignmnets = db
		.select()
		.from(assignmentTable)
		.where(
			and(
				eq(assignmentTable.ownerId, user.id),
				or(eq(assignmentTable.submitted, false), isNull(assignmentTable.submitted))
			)
		)
		.orderBy(asc(assignmentTable.dueDate));

	return {
		courses,
		assignmnets
	};
};

export const actions = {
	hideCourse: actionHelper(
		z.object({
			courseId: z.coerce.number()
		}),
		async ({ courseId }, { cookies }) => {
			const user = await validateSession(cookies.get('session'));

			if (!user) {
				return;
			}

			const courseList = await db
				.select()
				.from(coursesTable)
				.where(and(eq(coursesTable.courseId, courseId), eq(coursesTable.ownerId, user.id)));

			if (courseList.length < 1) {
				throw fail(401, {
					message: 'No course.'
				});
			}

			const course = courseList[0];

			await db
				.update(coursesTable)
				.set({
					hidden: true
				})
				.where(eq(coursesTable.courseId, course.courseId));

			return {
				success: true,
				message: 'Course hidden!'
			};
		}
	)
};
