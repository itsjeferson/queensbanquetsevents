import PageHero from '../../components/landing/PageHero/PageHero';
import ContactSection from '../../components/landing/Contact/Contact';
import Footer from '../../components/common/Footer/Footer';

export default function Contact() {
  return (
    <>
      <PageHero tag="Get in Touch" title="Let's Plan Your Event" />
      <ContactSection />
      <Footer simple />
    </>
  );
}
