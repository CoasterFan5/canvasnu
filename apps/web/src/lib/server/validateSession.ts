import { db, eq } from 'database';
import { sessionTable, user } from 'database';

export const validateSession = async (session: string | undefined) => {
	if (!session) {
		return false;
	}

	const users = await db
		.select()
		.from(sessionTable)
		.rightJoin(user, eq(sessionTable.userId, user.id))
		.where(eq(sessionTable.token, session));

	if (users.length < 1) {
		return false;
	}

	return users[0].user;
};
