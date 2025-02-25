import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPlannerFeed } from '$lib/canvas/functions/getPlannerFeed';
import { syncCourseData } from '$lib/server/dataManagers/syncCourseData';

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
