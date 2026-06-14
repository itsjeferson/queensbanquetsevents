import { createContext, useState } from 'react';

export const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const openBookingModal = (pkg = null) => {
    setSelectedPackage(pkg);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <BookingContext.Provider value={{
      bookingModalOpen,
      selectedPackage,
      openBookingModal,
      closeBookingModal,
    }}>
      {children}
    </BookingContext.Provider>
  );
}
