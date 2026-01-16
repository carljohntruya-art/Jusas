
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen bg-background font-body">
            <Navbar />
            
            {/* Hero Section */}
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 text-center">
                 <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-heading font-bold text-primary mb-6"
                 >
                    Our Tropical Story
                 </motion.h1>
                 <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-text/70 max-w-2xl mx-auto"
                 >
                    Bringing the island vibes to you, one smoothie at a time.
                 </motion.p>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                >
                    <img 
                        src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg" 
                        alt="Smoothie Preparation" 
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                         <h2 className="text-3xl font-heading font-bold text-secondary mb-4">Freshness First</h2>
                         <p className="text-text/80 leading-relaxed">
                             Jusas Tropical Smoothie began with a simple mission: to make the freshest, healthiest, and most delicious smoothies accessible to everyone. We believe that nature provides the best flavors, which is why we never use artificial sweeteners or preservatives.
                         </p>
                    </motion.div>

                    <motion.div
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.4 }}
                    >
                         <h2 className="text-3xl font-heading font-bold text-accent mb-4">Community & Joy</h2>
                         <p className="text-text/80 leading-relaxed">
                             More than just a drink, a smoothie is a moment of joy. We partner with local farmers to source our fruits, ensuring that every sip supports our community and tastes like pure sunshine.
                         </p>
                    </motion.div>

                     <motion.div
                         initial={{ opacity: 0, y: 30 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.6 }}
                    >
                         <h2 className="text-3xl font-heading font-bold text-primary mb-4">Our Promise</h2>
                         <ul className="space-y-2 text-text/80">
                             <li className="flex items-center gap-2"><span className="text-primary">✔</span> 100% Real Fruit</li>
                             <li className="flex items-center gap-2"><span className="text-primary">✔</span> No Added Sugars</li>
                             <li className="flex items-center gap-2"><span className="text-primary">✔</span> Made Fresh on Order</li>
                         </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
