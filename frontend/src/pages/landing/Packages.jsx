import PageHero from '../../components/landing/PageHero/PageHero';
import PackagesSection from '../../components/landing/Packages/Packages';
import Footer from '../../components/common/Footer/Footer';

export default function Packages() {
  return (
    <>
      <PageHero tag="Pricing" title="Our Packages" subtitle="Transparent, all-inclusive packages designed to give you the best value for your celebration." />
      <PackagesSection showHeader={false} />
      <Footer simple />
    </>
  );
}
