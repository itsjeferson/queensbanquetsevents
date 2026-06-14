import PageHero from '../../components/landing/PageHero/PageHero';
import GallerySection from '../../components/landing/Gallery/Gallery';
import Footer from '../../components/common/Footer/Footer';

export default function Gallery() {
  return (
    <>
      <PageHero tag="Portfolio" title="Our Gallery" subtitle="A visual journey through our most cherished events and moments." />
      <GallerySection showHeader={false} />
      <Footer simple />
    </>
  );
}
