import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies.get('session'));

	console.log(user);

	if (!user) {
		throw redirect(307, '/onboarding');
	}

	return {
		userId: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		canvasDomain: user.canvas_domain
	};
};
