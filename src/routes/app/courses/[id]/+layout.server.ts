import { db } from '$lib/server/db';
import { coursesTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, parent }) => {
	const courseId = parseInt(params.id);
	const parentData = await parent();

	const course = await db.select().from(coursesTable).where(eq(coursesTable.courseId, courseId));

	if (course.length < 1) {
		throw error(404, 'Course not found');
	}

	if (course[0].ownerId != parentData.userId) {
		throw error(403, "You can't view this content");
	}

	return {
		course: course[0]
	};
};
