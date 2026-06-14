import { Link } from 'react-router-dom';
import Hero from '../../components/landing/Hero/Hero';
import Services from '../../components/landing/Services/Services';
import Testimonials from '../../components/landing/Testimonials/Testimonials';
import Footer from '../../components/common/Footer/Footer';
import Button from '../../components/common/Button/Button';

export default function Home() {
  return (
    <>
      <Hero />
      <Services preview />
      <Testimonials />
      <div className="cta-strip">
        <h2 style={{ color: 'var(--white)', fontSize: 40, marginBottom: 16 }}>Ready to Create Your Story?</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 36, fontSize: 16 }}>Let&apos;s start planning your perfect event together.</p>
        <Link to="/register"><Button variant="white" size="lg">Start Planning Today</Button></Link>
      </div>
      <Footer />
    </>
  );
}
