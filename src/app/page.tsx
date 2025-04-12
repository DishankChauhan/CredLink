import { Hero } from '@/components/Hero';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { Logos3 } from '@/components/Logos3';
import FeatureSection from '@/components/FeatureSection';
import { GradualSpacing } from '@/components/ui/gradual-spacing';

// Sample testimonials - in a real app, these could come from a CMS or API
const testimonials = [
  {
    review: "CredLink has revolutionized how we verify academic credentials. The blockchain verification ensures that our certificates cannot be forged.",
    name: "Dr. Sarah Johnson",
    role: "Dean of Admissions",
    company: "Stanford University",
    logo: "/images/logo/logo1.png"
  },
  {
    review: "Our hiring process is now faster and more reliable. We can instantly verify candidate credentials without lengthy background checks.",
    name: "Michael Chen",
    role: "Head of HR",
    company: "Tesla Inc.",
    logo: "/images/logo/logo2.png"
  },
  {
    review: "The platform's security features give us confidence that our certification program maintains its integrity in the digital world.",
    name: "Emma Rodriguez",
    role: "Certification Director",
    company: "Microsoft Learning",
    logo: "/images/logo/logo3.png"
  }
];

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="w-full">
          <Hero />
          
          <div className="container mx-auto py-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Choose CredLink?</h2>
              <p className="text-gray-600">
                Our platform provides a secure, verifiable way to manage and share your credentials,
                powered by blockchain technology.
              </p>
            </div>
            
            <FeatureSection />
          </div>
          
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-4">What Our Users Say</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
              CredLink is trusted by universities, corporations, and certification bodies worldwide.
            </p>
            
            <TestimonialCarousel 
              testimonials={testimonials}
            />
          </div>

          <div className="bg-indigo-50 py-16 mt-20">
            <div className="container mx-auto">
              <GradualSpacing 
                text="Secure. Verifiable. Trusted." 
                className="text-3xl font-bold text-indigo-900"
                framerProps={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              />
              <p className="text-center text-gray-600 max-w-2xl mx-auto mt-6">
                Join thousands of professionals who trust CredLink to manage and verify their most important credentials.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <Logos3 heading="Trusted by Leading Organizations" />
          </div>
        </div>
      </main>
    </>
  );
} 