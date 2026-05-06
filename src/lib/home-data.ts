import { PublishStatus } from "@prisma/client";
import { FALLBACK_STAYS as STAY_FALLBACKS } from "./stay-data";
import { FALLBACK_EXPERIENCES as EXPERIENCE_FALLBACKS } from "./experience-data";
import { FALLBACK_PROGRAMS as PROGRAM_FALLBACKS } from "./program-data";
import { FALLBACK_COURSES as COURSE_FALLBACKS } from "./course-data";

function isPublished(status: unknown) {
  return status === PublishStatus.published || status === "published";
}

export const FALLBACK_STAYS = STAY_FALLBACKS
  .filter((item) => isPublished(item.status));

export const FALLBACK_EXPERIENCES = EXPERIENCE_FALLBACKS
  .filter((item) => isPublished(item.status));

export const FALLBACK_PROGRAMS = PROGRAM_FALLBACKS
  .filter((item) => isPublished(item.status));

export const FALLBACK_COURSES = COURSE_FALLBACKS
  .filter((item) => isPublished(item.status));
