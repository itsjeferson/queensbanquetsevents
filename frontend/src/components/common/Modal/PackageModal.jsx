import Modal from './Modal';
import Button from '../Button/Button';

export default function PackageModal({ isOpen, onClose }) {
  const handleSubmit = () => {
    onClose();
    alert('Package created successfully!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Package" subtitle="Create a new event package for clients.">
      <div className="form-group"><label>Package Name</label><input placeholder="e.g. Premium, Luxury..." /></div>
      <div className="form-row">
        <div className="form-group"><label>Price (₱)</label><input type="number" placeholder="0" /></div>
        <div className="form-group"><label>Max Guests</label><input type="number" placeholder="100" /></div>
      </div>
      <div className="form-group"><label>Description</label><textarea placeholder="Brief package description..." /></div>
      <div className="form-group">
        <label>Inclusions (one per line)</label>
        <textarea style={{ minHeight: 120 }} placeholder={'Event coordination (8 hrs)\nBasic table & chair setup\nFloral centerpieces...'} />
      </div>
      <div className="form-group">
        <label>Featured Package?</label>
        <select><option>No</option><option>Yes — Show as Most Popular</option></select>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>Cancel</Button>
        <Button variant="gold" style={{ flex: 2 }} onClick={handleSubmit}>Create Package</Button>
      </div>
    </Modal>
  );
}
