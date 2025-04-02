import { z } from "zod";
import { getPaginatedDataFromUrl } from "./getPaginatedDataFromUrl";
import { AssignmentSchema } from "../zodResponseTypes/assignmentSchemas";

export const getAssignmentsForCourse = async (
  domain: string,
  accessToken: string,
  courseId: number,
) => {
  const url = new URL(
    `https://${domain}/api/v1/courses/${courseId}/assignments?per_page=1000`,
  );

  const assignments = await getPaginatedDataFromUrl(
    url,
    accessToken,
    z.array(AssignmentSchema),
  );

  return assignments;
};
