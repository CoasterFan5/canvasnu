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
import * as canvas from "canvas";

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

    const courseAssignmentsPromise = canvas.functions.getCourseAssignments(
      u.canvas_domain,
      u.access_token,
    );

    const courses = await db
      .select({
        externalId: coursesTable.externalId,
        id: coursesTable.courseId,
      })
      .from(coursesTable)
      .where(eq(coursesTable.ownerId, u.id));

    // maps external to internal id
    const courseMap: {
      [key: number]: number;
    } = {};
    for (const c of courses) {
      courseMap[c.externalId] = c.id;
    }

    const courseAssignments = await courseAssignmentsPromise;
    const dbPromises = [];

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
            courseId: courseMap[assignment.course_id],
            externalCourseId: assignment.course_id,
            dueDate: assignment.due_at ? new Date(assignment.due_at) : null,
            grade: 0,
            submitted:
              assignment.submission?.workflow_state !== "unsubmitted" ||
              assignment.locked_for_user,
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
                assignment.submission?.workflow_state !== "unsubmitted" ||
                assignment.locked_for_user,
              courseId: courseMap[assignment.course_id],
              description: assignment.description,
            },
          }),
      );
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
