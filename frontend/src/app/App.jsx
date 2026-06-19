import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import AppRoutes from './routes';
import '../styles/globals.css';
import '../styles/responsive.css';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}
