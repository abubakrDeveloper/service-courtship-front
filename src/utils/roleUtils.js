// utils/roleUtils.js
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  SELLER: "SELLER",
  EMPLOYEE: "EMPLOYEE",
};

export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

// Qo‘shimcha helperlar:
export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const canViewReports = (user) =>
  [ROLES.ADMIN, ROLES.MANAGER].includes(user?.role);
export const canEditProducts = (user) =>
  [ROLES.ADMIN, ROLES.SELLER].includes(user?.role);
