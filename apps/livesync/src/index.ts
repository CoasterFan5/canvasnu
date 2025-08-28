import { EventEmitter } from "events";
import { z } from "zod";
import {
  assignmentTable,
  coursesTable,
  db,
  eq,
  gt,
  isNull,
  lt,
  or,
  user,
} from "database";
import { CanvasLMS } from "clmssdkts";

const SIXTY_SECONDS = 60 * 1000;
const TEN_MINUTES = 10 * SIXTY_SECONDS;

let activeSync = false;

setInterval(async () => {
  if (activeSync) {
    console.info("Active sync cancled sync task");
    return;
  }

  activeSync = true;

  const assignmentSyncRequests = await db
    .select()
    .from(user)
    .where(
      or(
        lt(user.lastAssignmentSync, new Date(Date.now() - TEN_MINUTES)),
        isNull(user.lastAssignmentSync),
      ),
    );

  if (assignmentSyncRequests.length < 1) {
    activeSync = false;
    console.info("Sync found 0 req");
  }

  if (assignmentSyncRequests.length >= 1) {
    activeSync = true;
    console.info(`Syncing data for ${assignmentSyncRequests.length} user.`);
  }

  for (const u of assignmentSyncRequests) {
    const startTime = Date.now();
    console.log(`Performing sync of ${u.firstName} ${u.lastName}`);

    const canvas = new CanvasLMS({
      domain: `https://${u.canvas_domain}/api`,
      accessToken: u.access_token,
    });

    const courses = await canvas.listYourCourses({});
    if (!courses) {
      continue;
    }

    const dbPromises = [];

    for (const c of courses) {
      const newCourse = await db
        .insert(coursesTable)
        .values({
          ownerId: u.id,
          domain: u.canvas_domain,
          externalId: c.id,
          name: c.name,
        })
        .onConflictDoUpdate({
          target: [
            coursesTable.ownerId,
            coursesTable.externalId,
            coursesTable.domain,
          ],
          set: {
            name: c.name,
          },
        })
        .returning();

      // also get the courses
      const courseAssignments = await canvas.listAssignmentsAssignments({
        course_id: c.id.toString(),
      });

      if (!courseAssignments) {
        continue;
      }

      for (const assignment of courseAssignments) {
        dbPromises.push(
          db
            .insert(assignmentTable)
            .values({
              ownerId: u.id,
              externalId: assignment.id,
              domain: u.canvas_domain,
              externalUrl: assignment.html_url,
              name: assignment.name,
              courseId: newCourse[0].courseId,
              externalCourseId: assignment.course_id,
              dueDate: assignment.due_at ? new Date(assignment.due_at) : null,
              grade: 0,
              submitted:
                assignment.has_submitted_submissions ||
                assignment.locked_for_user ||
                assignment.graded_submissions_exist,
              description: assignment.description,
            })
            .onConflictDoUpdate({
              target: [
                coursesTable.externalId,
                coursesTable.ownerId,
                coursesTable.domain,
              ],
              set: {
                dueDate: assignment.due_at ? new Date(assignment.due_at) : null,
                grade: 0,
                submitted:
                  assignment.has_submitted_submissions ||
                  assignment.locked_for_user ||
                  assignment.graded_submissions_exist,
                courseId: newCourse[0].courseId,
                description: assignment.description,
              },
            }),
        );
      }
    }

    await Promise.all(dbPromises);
    await db
      .update(user)
      .set({
        lastAssignmentSync: new Date(),
      })
      .where(eq(user.id, u.id));

    console.log(`Sync done in ${Date.now() - startTime}ms`);
  }

  activeSync = false;
}, 10_000);

console.log(`Livesync Started`);
