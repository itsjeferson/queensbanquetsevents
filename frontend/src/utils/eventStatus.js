const STATUS_META = {
  draft: { label: 'Draft', badge: 'badge-gray' },
  pending_approval: { label: 'Pending Approval', badge: 'badge-blue' },
  published: { label: 'Published', badge: 'badge-green' },
  archived: { label: 'Archived', badge: 'badge-red' },
};

export function eventStatusMeta(status) {
  return STATUS_META[status] || { label: status, badge: 'badge-gray' };
}
