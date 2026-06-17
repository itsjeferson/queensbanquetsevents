import InvitationRenderer from './InvitationRenderer';
import { buildInvitationPreviewData } from '../../utils/invitationPreview';

export default function InvitationPreviewModal({ open, onClose, data, title = 'Invitation Preview' }) {
  if (!open || !data) return null;

  const previewData = buildInvitationPreviewData(data);

  return (
    <div className="modal-overlay open" onClick={onClose} role="presentation">
      <div className="modal modal-preview" onClick={(event) => event.stopPropagation()}>
        <div className="modal-preview-header">
          <div>
            <h2>{title}</h2>
            <p className="modal-sub">{previewData.event.event_name}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close preview">
            ×
          </button>
        </div>
        <div className="invitation-preview-frame">
          <InvitationRenderer data={previewData} />
        </div>
      </div>
    </div>
  );
}
