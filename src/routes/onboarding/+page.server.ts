import { zodResponseTypes } from '$lib/canvas';
import { actionHelper } from '$lib/server/actionHelper';
import { createSession } from '$lib/server/createSession';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const actions = {
	login: actionHelper(
		z.object({
			canvasUrl: z.string(),
			accessToken: z.string()
		}),
		async ({ canvasUrl, accessToken }, { cookies }) => {
			let canvasUrlBase: URL;

			try {
				canvasUrlBase = new URL(`https://${canvasUrl}/api/v1/users/self`);
			} catch {
				return fail(401, {
					success: false,
					message: 'Invalid URL.'
				});
			}

			const fetchRequest: false | Response = await fetch(canvasUrlBase.toString(), {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'content-type': 'application/json'
				},
				method: 'get'
			})
				.then((e) => {
					return e;
				})
				.catch(() => {
					return false;
				});

			if (!fetchRequest) {
				return fail(401, {
					message: 'Invalid domain'
				});
			}

			const response = await fetchRequest.json();

			const responseFormed = zodResponseTypes.userObject.safeParse(response);

			if (responseFormed.error) {
				if (
					response &&
					response.errors &&
					response.errors.length > 0 &&
					response?.errors[0].message == 'Invalid access token.'
				) {
					return fail(401, {
						success: false,
						message: 'Invalid Access Token.'
					});
				}

				console.log(response);
				return fail(401, {
					success: false,
					message: 'Error parsing data.'
				});
			}

			const userData = responseFormed.data;

			// check if a user already exists

			const userCheck = await db
				.select()
				.from(user)
				.where(and(eq(user.canvas_id, userData.id), eq(user.canvas_domain, canvasUrl)));

			if (userCheck.length > 0) {
				await db.update(user).set({
					access_token: accessToken
				});

				await createSession(userCheck[0], cookies);

				throw redirect(307, '/app');
			}

			const newUser = await db
				.insert(user)
				.values({
					canvas_id: userData.id,
					canvas_domain: canvasUrl,
					access_token: accessToken,
					createdAt: userData.created_at.toISOString(),
					lastName: userData.last_name,
					firstName: userData.first_name,
					pronouns: userData.pronouns,
					locale: userData.locale,
					effective_local: userData.effective_local,
					avatar_url: userData.avatar_url,
					permissions_can_update_name: userData.permissions.can_update_name,
					permissions_can_update_avatar: userData.permissions.can_update_avatar,
					permissions_limit_parent_app_web_access: userData.permissions.limit_parent_app_web_access
				})
				.returning();

			await createSession(newUser[0], cookies);
			throw redirect(307, '/app');

			return {
				success: true,
				message: 'Loggin in new...'
			};
		}
	)
};
