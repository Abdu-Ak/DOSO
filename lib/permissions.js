export const Roles = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  ALUMNI: "alumni",
  STUDENT: "student",
};

/**
 * Checks if the current user can perform an action on a target user based on roles.
 *
 * Rules:
 * 1. super_admin can do everything to everyone except maybe deleting themselves (handled separately).
 * 2. admin can manage alumni and students.
 * 3. admin cannot manage other admins or super_admins.
 * 4. admin can see themselves but usually shouldn't delete/edit their own core role via this interface.
 *
 * @param {Object} currentUser - The currently logged in user (session data)
 * @param {Object} targetUser - The user being acted upon (from table/profile)
 * @param {string} action - 'view' | 'edit' | 'delete'
 * @returns {boolean}
 */
export const canManageUser = (currentUser, targetUser, action) => {
  if (!currentUser || !targetUser) return false;

  // super_admin is god mode
  if (currentUser.role === Roles.SUPER_ADMIN) {
    return true;
  }

  // admin permissions
  if (currentUser.role === Roles.ADMIN) {
    // Cannot manage super_admins
    if (targetUser.role === Roles.SUPER_ADMIN) return false;

    // Cannot manage other admins
    if (targetUser.role === Roles.ADMIN) {
      // Only allow if it's NOT the same user to prevent self-deletion/edit in management view
      // But the user said "if me is admin hide", so we hide for self as well.
      return false;
    }

    // Can manage alumni and students
    if (targetUser.role === Roles.ALUMNI || targetUser.role === Roles.STUDENT) {
      return true;
    }
  }

  return false;
};
