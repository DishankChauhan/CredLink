export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-12 shadow-xl">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Your credentials, verified and trusted on-chain
          </h1>
          <p className="text-xl opacity-90">
            Upload your academic credentials and work experience. Get them verified by issuers and secured on the blockchain.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a href="/register" className="bg-white text-indigo-700 px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition">
              Get Started
            </a>
            <a href="/learn-more" className="border border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Upload Credentials</h3>
            <p className="text-gray-600">Easily upload your degrees, certificates, and work experience to your secure profile.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Request Verification</h3>
            <p className="text-gray-600">Send verification requests to issuers like universities and employers who can validate your credentials.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Secured On Blockchain</h3>
            <p className="text-gray-600">Once verified, your credentials are securely hashed and stored on the blockchain, providing immutable proof.</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-gray-100 p-12 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to build your verified credential profile?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of professionals who are securing their credentials on the blockchain and sharing verified information with employers.
        </p>
        <a href="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition">
          Create Your Profile
        </a>
      </section>
    </div>
  );
} 