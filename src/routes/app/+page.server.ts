import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPlannerFeed } from '$lib/canvas/functions/getPlannerFeed';
import { syncCourseData } from '$lib/server/dataManagers/syncCourseData';
import { db } from '$lib/server/db';
import { coursesTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies.get('session'));

	if (!user) {
		throw redirect(307, '/onboarding');
	}

	const courses = db.select().from(coursesTable).where(eq(coursesTable.ownerId, user.id));
	const planner = getPlannerFeed(user.canvas_domain, user.access_token);

	return {
		courses,
		planner
	};
};
