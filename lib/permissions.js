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

  const currentUserId = (currentUser._id || currentUser.id)?.toString();
  const targetUserId = (
    targetUser._id ||
    targetUser.id ||
    targetUser._id
  )?.toString();

  // Rule: High-level status protection
  // Nobody can change a super admin's status (not even themselves)
  if (targetUser.role === Roles.SUPER_ADMIN && action === "status") {
    return false;
  }

  // Rule: Users can edit/view their own profile via direct links (Topbar/Profile)
  if (currentUserId === targetUserId) {
    if (action === "view" || action === "edit" || action === "status")
      return true;
    // In user management table (no action), hide buttons for the logged-in admin themselves
    if (!action) return false;
  }

  // super_admin god mode
  if (currentUser.role === Roles.SUPER_ADMIN) return true;

  // admin permissions
  if (currentUser.role === Roles.ADMIN) {
    // Cannot manage super_admins
    if (targetUser.role === Roles.SUPER_ADMIN) return false;

    // CAN manage other admins (the self-check above handles hiding 'me')
    if (targetUser.role === Roles.ADMIN) return true;

    // Can manage alumni and students
    if (targetUser.role === Roles.ALUMNI || targetUser.role === Roles.STUDENT) {
      return true;
    }
  }

  return false;
};
