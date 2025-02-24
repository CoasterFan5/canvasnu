import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const user = await validateSession(cookies.get('session'));
	if (!user) {
		throw redirect(307, '/onboarding');
	}

	return {
		firstName: user.firstName,
		lastName: user.lastName
	};
};
