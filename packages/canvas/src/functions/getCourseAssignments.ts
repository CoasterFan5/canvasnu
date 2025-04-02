import { getPaginatedDataFromUrl } from "./getPaginatedDataFromUrl";
import { courseListWithGradesObject } from "../zodResponseTypes/courseWithGrades";
import { getAssignmentsForCourse } from "./getAssignmentsForCourse";
/* Return course assignments for each course the user is in */
export const getCourseAssignments = async (
  domain: string,
  accessToken: string,
) => {
  const url = new URL(`https://${domain}/api/v1/courses?per_page=1000`);

  const courses = await getPaginatedDataFromUrl(
    url,
    accessToken,
    courseListWithGradesObject,
  );

  let courseAssignments: ReturnType<typeof getAssignmentsForCourse>[] = [];

  for (const c of courses) {
    courseAssignments = courseAssignments.concat(
      getAssignmentsForCourse(domain, accessToken, c.id),
    );
  }

  const awaitedCourseAssignments = (await Promise.all(courseAssignments)).flat(
    1,
  );

  return awaitedCourseAssignments;
};
