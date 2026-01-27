import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl md:text-6xl">
            Find Your Perfect Mentor
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
            Connect with experienced professionals who can guide you on your career journey.
            Get personalized advice, resume reviews, mock interviews, and more.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/mentors"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors"
            >
              Browse Mentors
            </Link>
            <Link
              href="/auth/signup"
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-8 py-3 rounded-lg text-base font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Expert Guidance</h3>
            <p className="text-slate-600">
              Get advice from industry professionals with years of experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Flexible Sessions</h3>
            <p className="text-slate-600">
              Book sessions at your convenience with mentors from around the world.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Verified Mentors</h3>
            <p className="text-slate-600">
              All mentors are verified and have a proven track record of success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
