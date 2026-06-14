import PageHero from '../../components/landing/PageHero/PageHero';
import ServicesSection from '../../components/landing/Services/Services';
import Footer from '../../components/common/Footer/Footer';

export default function Services() {
  return (
    <>
      <PageHero tag="What We Do" title="Our Services" subtitle="Comprehensive event management solutions tailored to every occasion, budget, and vision." />
      <ServicesSection showHeader={false} />
      <Footer simple />
    </>
  );
}
