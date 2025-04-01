import { getCanvasCourses } from "../functions/getCanvasCourses";
import { and, eq } from "database";
import { db } from "database";
import { coursesTable, user } from "database";

const ONE_HOUR = 60 * 60 * 1000;

/*
Uses the canvas API to sync course data to the nucanvas database. Data should be re-synced every 1 hour.
If data has been synced recently, will return data from the database.
*/

export const syncCourseData = async (dbUser: typeof user.$inferSelect) => {
  if (
    !dbUser.lastCourseSync ||
    Date.now() - ONE_HOUR > dbUser.lastCourseSync.getTime()
  ) {
    const dbCourses = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.ownerId, dbUser.id));
    const apiCourses = await getCanvasCourses(
      dbUser.canvas_domain,
      dbUser.access_token,
    );
    console.log(`Synced course data...`);

    if (!apiCourses) {
      return [];
    }

    // flatter for ids
    const dbCourseIds = dbCourses.map((c) => c.externalId);

    for (const apiCourse of apiCourses) {
      if (!dbCourseIds.includes(apiCourse.id)) {
        await db.insert(coursesTable).values({
          ownerId: dbUser.id,
          domain: dbUser.canvas_domain,
          externalId: apiCourse.id,
          name: apiCourse.name,
          nickname: apiCourse.friendly_name || apiCourse.name,
          image: apiCourse.image_download_url,
          color: "#ffffff",
          hidden: false,
          currentGrade: 0,
        });
      }
    }

    await db
      .update(user)
      .set({
        lastCourseSync: new Date(),
      })
      .where(eq(user.id, dbUser.id));
  }

  return await db
    .select()
    .from(coursesTable)
    .where(
      and(eq(coursesTable.ownerId, dbUser.id), eq(coursesTable.hidden, false)),
    );
};
