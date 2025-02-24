import type { Cookies } from '@sveltejs/kit';
import { db } from './db';
import { sessionTable, type user } from './db/schema';
import crypto from 'crypto';

type User = typeof user.$inferSelect;

export const createSession = async (user: User, cookies: Cookies) => {
	const sessionToken = crypto.randomBytes(128).toString('base64url');

	await db
		.insert(sessionTable)
		.values({
			token: sessionToken,
			userId: user.id
		})
		.returning();

	cookies.set('session', sessionToken, {
		path: '/',
		secure: true,
		sameSite: 'strict'
	});

	return {
		sessionToken
	};
};
