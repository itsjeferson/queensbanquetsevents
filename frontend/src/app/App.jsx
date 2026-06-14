import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { BookingProvider } from '../context/BookingContext';
import { NotificationProvider } from '../context/NotificationContext';
import AppRoutes from './routes';
import '../styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
