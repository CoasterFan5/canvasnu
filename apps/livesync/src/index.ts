import { EventEmitter } from "events";
import { z } from "zod";
import { db, gt, lt, user } from "database";
import { dataManagers } from "canvas";

const SIXTY_SECONDS = 60 * 1000;
const TEN_MINUTES = 10 * SIXTY_SECONDS;

let activeSync = false;

setInterval(async () => {
  if (activeSync) {
    return;
  }

  const assignmentSyncRequests = await db
    .select()
    .from(user)
    .where(lt(user.lastAssignmentSync, new Date(Date.now() - TEN_MINUTES)));

  if (assignmentSyncRequests.length > 1) {
    activeSync = true;
    console.info(`Syncing data for ${assignmentSyncRequests.length} user.`);
  }

  for (const user of assignmentSyncRequests) {
    await dataManagers.syncPlanner(user);
  }

  activeSync = false;
}, 10_000);

console.log(`Livesync Started`);
