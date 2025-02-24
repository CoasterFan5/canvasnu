import { getCanvasCourses } from '$lib/canvas/functions/getCanvasCourses';
import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies.get('session'));

	if (!user) {
		throw redirect(307, '/onboarding');
	}

	const courses = getCanvasCourses(user.canvas_domain, user.access_token);

	return {
		courses
	};
};
