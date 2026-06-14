import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import BookingModal from '../components/common/Modal/BookingModal';

export default function LandingLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <BookingModal />
    </>
  );
}
