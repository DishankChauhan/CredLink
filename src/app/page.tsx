import { Hero } from '@/components/Hero';

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Secure Credentials</h2>
            <p className="text-gray-600">
              Store your educational, professional, and certification credentials securely on the blockchain.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Verified by Institutions</h2>
            <p className="text-gray-600">
              Get your credentials verified by registered issuers to increase their credibility.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Share with Confidence</h2>
            <p className="text-gray-600">
              Share your verified credentials with employers, institutions, and organizations securely.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 