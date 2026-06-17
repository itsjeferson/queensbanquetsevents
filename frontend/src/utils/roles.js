export function isAdminRole(role) {
  return role === 'admin' || role === 'super_admin';
}

export function adminRoleLabel(role) {
  if (role === 'super_admin') return '★ Super Admin';
  if (role === 'admin') return 'Administrator';
  return 'Client Account';
}
