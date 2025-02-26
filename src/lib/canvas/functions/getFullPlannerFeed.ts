import { PlannerItemsResponseSchema } from '../zodResponseTypes/plannerSchemas';

import parse from 'parse-link-header';

function dataOrEmptyArrayOf<T>(a: T[] | undefined) {
	return a ? a : [];
}

const getDataFromUrl = async (url: string, accessToken: string): ReturnType<typeof parseBody> => {
	const req = await fetch(url, {
		method: 'get',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'content-type': 'application/json'
		}
	});

	const linkParsed = parse(req.headers.get('link'));
	if (linkParsed?.next?.url) {
		const newData: ReturnType<typeof parseBody> = getDataFromUrl(linkParsed.next.url, accessToken);
		const bodyData = await parseBody(req);
		return [...dataOrEmptyArrayOf(bodyData), ...dataOrEmptyArrayOf(await newData)];
	} else {
		return await parseBody(req);
	}
};

const parseBody = async (response: Response) => {
	const body = await response.json();
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

export const getFullPlannerFeed = async (canvasDomain: string, accessToken: string) => {
	const url = `https://${canvasDomain}/api/v1/planner/items?per_page=100&order=asc`;
	const data = await getDataFromUrl(url, accessToken);
	return data;
};
