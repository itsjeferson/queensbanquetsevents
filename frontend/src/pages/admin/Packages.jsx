import { useOutletContext } from 'react-router-dom';
import PackageManager from '../../components/admin/PackageManager/PackageManager';

export default function AdminPackages() {
  const { openPackageModal } = useOutletContext();

  return (
    <>
      <div className="dash-header">
        <h1>Package Management</h1>
        <p>Create, edit, and manage event packages.</p>
      </div>
      <PackageManager onAdd={openPackageModal} />
    </>
  );
}
