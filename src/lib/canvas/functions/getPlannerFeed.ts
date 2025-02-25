import { PlannerItemsResponseSchema } from '../zodResponseTypes/plannerSchemas';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const getPlannerFeed = async (canvasDomain: string, accessToken: string) => {
	const startDate = new Date(Date.now() - SEVEN_DAYS);
	const url = `https://${canvasDomain}/api/v1/planner/items?per_page=100&start_date=${startDate.toISOString()}&order=asc`;

	console.log(url);
	const req = await fetch(url, {
		method: 'get',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'content-type': 'application/json'
		}
	});

	const body = await req.json();
	const parsedBody = PlannerItemsResponseSchema.safeParse(body);
	if (parsedBody.error) {
		for (const issue of parsedBody.error.issues) {
			console.log(issue.message);
			console.log(issue.code);
			console.log(issue.path);
			console.log(`----`);
		}
	} else {
		return parsedBody.data;
	}
};
