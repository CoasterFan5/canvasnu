import { logManager } from '$lib/server/logManager/logManager';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (req) => {
	logManager.log({
		type: 'info',
		alert: false,
		message: JSON.stringify(req)
	});

	return new Response('yay');
};
