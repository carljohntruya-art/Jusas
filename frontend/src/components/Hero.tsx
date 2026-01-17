import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative pt-24 pb-12 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-text leading-tight"
            >
              Enjoy every sip of <span className="text-primary">Summer Crush</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg text-text/80 max-w-lg mx-auto md:mx-0"
            >
              Fresh, organic, and bursting with tropical flavors. Handcrafted smoothies made with love and nature's finest ingredients.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex justify-center md:justify-start space-x-4"
            >
              <Link to="/menu" className="px-8 py-4 bg-accent text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform">
                Order Now
              </Link>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
               {/* Placeholder for the main hero smoothie image */}
               <img 
                 src="https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=800" 
                 srcSet="https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=400 400w,
                         https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=800 800w"
                 sizes="(max-width: 640px) 100vw, 50vw"
                 alt="Delicious Smoothie" 
                 loading="eager"
                 decoding="async"
                 className="w-full h-full object-cover rounded-3xl shadow-2xl md:rotate-3 md:hover:rotate-0 transition-all duration-500"
               />
               
               {/* Floating elements - hidden on mobile for performance */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="hidden md:block absolute -top-10 -right-10 bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50"
               >
                 <span className="text-2xl">🍓</span>
                 <span className="font-bold text-text ml-2">Fresh</span>
               </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
