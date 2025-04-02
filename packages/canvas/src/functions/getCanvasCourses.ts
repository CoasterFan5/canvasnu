// https://canvas.jmu.edu/api/v1/courses?include[]=total_scores

import { courseListWithGradesObject } from "../zodResponseTypes/courseWithGrades";

export const getCanvasCourses = async (
  canvasDomain: string,
  accessToken: string,
) => {
  const req = await fetch(
    `https://${canvasDomain}/api/v1/courses?include[]=total_scores&include[]=course_image&per_page=10000`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
    },
  );

  const body = await req.json();

  const parsedBody = courseListWithGradesObject.safeParse(body);
  if (parsedBody.error) {
    console.warn("Course parse error");
    console.log(body);
    console.log(JSON.stringify(parsedBody.error.issues));
    return [];
  } else {
    return parsedBody.data;
  }
};
