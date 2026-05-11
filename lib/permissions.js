export const Roles = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  ALUMNI: "alumni",
  STUDENT: "student",
};

export const PERMISSION_MODULES = [
  { key: "alumni", label: "User Management" },
  { key: "students", label: "Students" },
  { key: "events", label: "Events" },
  { key: "sundook", label: "Sundook" },
  { key: "debt_requests", label: "Debt Requests" },
  { key: "welfare", label: "Welfare" },
  { key: "enquiries", label: "Enquiries" },
  { key: "settings", label: "Settings" },
  { key: "permission_management", label: "Permission Management" },
];

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
    if (
      targetUser.role === Roles.ALUMNI ||
      targetUser.role === Roles.STUDENT ||
      targetUser.studentId // Fallback for student objects without role
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if a user has the required permission for a specific module.
 *
 * @param {Object} user - The user object containing role and permissions
 * @param {String} moduleName - The name of the module (e.g., 'alumni', 'students', etc.)
 * @param {String} permissionType - The type of permission ('access' or 'manage')
 * @returns {Boolean} True if the user has permission, false otherwise
 */
export const hasPermission = (user, moduleName, permissionType = "access") => {
  if (!user) return false;

  // Super admin has full access and manage rights to everything
  if (user.role === Roles.SUPER_ADMIN) return true;

  // For other admins, check their specific permissions
  if (user.role === Roles.ADMIN) {
    // Strictly lock permission_management to super_admin
    // if (moduleName === "permission_management") return false;

    // Check if the permission exists for the requested module and type
    return user.permissions?.[moduleName]?.[permissionType] === true;
  }

  // Other roles don't have admin permissions
  return false;
};
