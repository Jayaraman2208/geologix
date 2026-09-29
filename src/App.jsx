import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import RoutePlanner from './pages/RoutePlanner'
import Vehicles from './pages/Vehicles'
import LiveTracking from './pages/LiveTracking'
import Analytics from './pages/Analytics'
import RiskIntelligence from './pages/RiskIntelligence'
import EmergencyLogistics from './pages/EmergencyLogistics'
import AdminPanel from './pages/AdminPanel'
import StockPredictionDashboard from './components/StockPredictionDashboard'
import RiderAssistant from './components/RiderAssistant'
import Login from './pages/Login'
import Register from './pages/Register'
import supabaseApi from './lib/supabaseApi'
import './styles/rider-assistant.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const user = await supabaseApi.getCurrentUser()
      if (user) {
        setIsLoggedIn(true)
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
    setShowRegister(false)
  }

  const handleLogout = async () => {
    await supabaseApi.logout()
    setIsLoggedIn(false)
  }

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard':
        return <Dashboard />
      case 'route':
        return <RoutePlanner />
      case 'vehicles':
        return <Vehicles />
      case 'live':
        return <LiveTracking />
      case 'analytics':
        return <Analytics />
      case 'risk':
        return <RiskIntelligence />
      case 'emergency':
        return <EmergencyLogistics />
      case 'stock':
        return <StockPredictionDashboard />
      case 'rider':
        return <RiderAssistant />
      case 'admin':
        return <AdminPanel />
      default:
        return <Dashboard />
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!isLoggedIn) {
    return showRegister ? 
      <Register onLogin={handleLogin} onSwitchToLogin={() => setShowRegister(false)} /> :
      <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
  }

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <div className="main-content">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default App
