import { useState } from 'react'
import supabaseApi from '../lib/supabaseApi'

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill all fields'); return }
    setLoading(true)
    const result = await supabaseApi.login(email, password)
    if (result.success) {
      onLogin()
    } else {
      setError(result.error || 'Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <img src="/logo.jpeg" alt="GEOLOGIX" className="login-logo" />
          <h1>GEOLOGIX</h1>
          <p>SMARTER ROUTES. STRONGER NER.</p>
        </div>
        <div className="login-form">
          <h2>Welcome Back</h2>
          <p>Sign in to your logistics workspace</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign In →'}</button>
          </form>
          <p className="signup-link">New to Geologix? <a href="#" onClick={(e) => { e.preventDefault(); onRegister(); }}>Create account</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login
