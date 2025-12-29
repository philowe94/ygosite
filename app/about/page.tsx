import Header from '@/components/Header'

export default function About() {
  return (
    <main className="flex-1 md:ml-64">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About YgoSite</h1>
          <p className="text-xl text-gray-600">
            Learn more about our modern Next.js application
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              YgoSite is built with the latest web technologies to provide a fast, modern, and 
              user-friendly experience. We leverage Next.js 14, TypeScript, and Tailwind CSS 
              to create performant and beautiful web applications.
            </p>
            <p className="text-gray-700">
              Our goal is to demonstrate best practices in modern web development while 
              providing a solid foundation for building scalable applications.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technologies Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Frontend</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Next.js 14 with App Router</li>
                  <li>• React 18</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Development</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• ESLint</li>
                  <li>• PostCSS</li>
                  <li>• Autoprefixer</li>
                  <li>• Modern build tools</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• Responsive design that works on all devices</li>
              <li>• Modern UI with beautiful gradients and animations</li>
              <li>• Type-safe development with TypeScript</li>
              <li>• Optimized performance with Next.js</li>
              <li>• SEO-friendly with proper meta tags</li>
              <li>• Dark mode support</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
