import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Via-Trip</h1>
          <div className="space-x-4">
            {isLoggedIn ? (
              <Link to="/trip-setup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Plan New Trip
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Plan Your Perfect Road Trip
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Discover amazing places along your route. Personalize your journey with Via-Trip.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="font-semibold mb-2">1. Create Account</h3>
            <p className="text-gray-600 text-sm">Sign up as Traveler or Place Owner</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">🗺️</div>
            <h3 className="font-semibold mb-2">2. Setup Trip</h3>
            <p className="text-gray-600 text-sm">Enter origin, destination, and travel style</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">📍</div>
            <h3 className="font-semibold mb-2">3. Build Itinerary</h3>
            <p className="text-gray-600 text-sm">Add places and check feasibility</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
