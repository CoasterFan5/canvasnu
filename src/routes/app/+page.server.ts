import { validateSession } from '$lib/server/validateSession';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPlannerFeed } from '$lib/canvas/functions/getPlannerFeed';
import { syncCourseData } from '$lib/server/dataManagers/syncCourseData';
import { actionHelper } from '$lib/server/actionHelper';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { coursesTable } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies.get('session'));

	if (!user) {
		throw redirect(307, '/onboarding');
	}

	const courses = syncCourseData(user);
	const planner = getPlannerFeed(user.canvas_domain, user.access_token);

	return {
		courses,
		planner
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
		}
	)
};
