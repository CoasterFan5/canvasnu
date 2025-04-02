import { userObject } from "./zodResponseTypes/userObject";

import { getCanvasCourses } from "./functions/getCanvasCourses";
import { getFullPlannerFeed } from "./functions/getFullPlannerFeed";
import { getCourseAssignments } from "./functions/getCourseAssignments";

import { syncCourseData } from "./dataManagers/syncCourseData";
import { syncPlanner } from "./dataManagers/syncPlanner";

export const zodObjects = {
  userObject,
};

export const functions = {
  getCanvasCourses,
  getFullPlannerFeed,
  getCourseAssignments,
};

export const dataManagers = {
  syncCourseData,
  syncPlanner,
};
