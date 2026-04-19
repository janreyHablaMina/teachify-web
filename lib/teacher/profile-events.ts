export const TEACHER_PROFILE_UPDATED_EVENT = "teachify:teacher-profile-updated";

export type TeacherProfileUpdatedDetail = {
  fullname?: string;
  displayName?: string;
  email?: string;
  profilePhotoPath?: string;
  profilePhotoUrl?: string;
};

export function emitTeacherProfileUpdated(detail: TeacherProfileUpdatedDetail) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<TeacherProfileUpdatedDetail>(TEACHER_PROFILE_UPDATED_EVENT, {
      detail,
    })
  );
}
