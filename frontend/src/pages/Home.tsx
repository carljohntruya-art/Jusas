
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import BestSellers from '../components/BestSellers';

const Home = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <BestSellers />
      </main>
    </div>
  );
};

export default Home;
