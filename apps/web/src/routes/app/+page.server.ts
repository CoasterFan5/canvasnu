import { validateSession } from '$lib/server/validateSession';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { actionHelper } from '$lib/server/actionHelper';
import { z } from 'zod';
import { db } from 'database';
import { assignmentTable, coursesTable } from 'database';
import { and, asc, eq, isNull, or } from 'database';
import { dataManagers } from 'canvas';
import { logManager } from '$lib/server/logManager/logManager';

const TEN_MINUTES = 10 * 60 * 1000;
const SIXTY_MINUTES = 6 * TEN_MINUTES;

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies.get('session'));

	if (!user) {
		throw redirect(307, '/onboarding');
	}

	const courses = dataManagers.syncCourseData(user);

	if (!user.lastAssignmentSync || user.lastAssignmentSync?.getTime() < Date.now() - SIXTY_MINUTES) {
		logManager.log({
			type: 'warn',
			message: 'Planner just synced from web app',
			alert: true
		});
		await dataManagers.syncPlanner(user);
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
				return fail(401, {
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
	),
	changeColor: actionHelper(
		z.object({
			courseId: z.coerce.number(),
			color: z.string()
		}),
		async ({ courseId, color }, { cookies }) => {
			const user = await validateSession(cookies.get('session'));

			if (!user) {
				return;
			}

			const courseList = await db
				.select()
				.from(coursesTable)
				.where(and(eq(coursesTable.courseId, courseId), eq(coursesTable.ownerId, user.id)));

			if (courseList.length < 1) {
				return fail(401, {
					message: 'No course.'
				});
			}

			const course = courseList[0];
			console.log(color);

			await db
				.update(coursesTable)
				.set({
					color: color
				})
				.where(eq(coursesTable.courseId, course.courseId));

			return {
				success: true,
				message: 'Course updated!'
			};
		}
	)
};
