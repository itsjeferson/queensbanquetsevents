import { packages } from '../../../data/packages';
import { formatCurrency } from '../../../utils/currencyFormatter';
import Button from '../../common/Button/Button';

export default function PackageManager({ onAdd }) {
  return (
    <>
      <div style={{ textAlign: 'right', marginBottom: 20 }}>
        <Button variant="gold" onClick={onAdd}>+ Add Package</Button>
      </div>
      <div className="card-widget">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Price</th>
                <th>Max Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td><strong>{pkg.name}{pkg.featured ? ' ⭐' : ''}</strong></td>
                  <td>{formatCurrency(pkg.price)}</td>
                  <td>{pkg.maxGuests}</td>
                  <td><span className="badge badge-green">Active</span></td>
                  <td>
                    <button type="button" className="action-btn">Edit</button>
                    <button type="button" className="action-btn danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
