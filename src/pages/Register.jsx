import { useState } from 'react'
import supabaseApi from '../lib/supabaseApi'

function Register({ onRegister, onLogin }) {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirm_password: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.full_name || !formData.email || !formData.password) { setError('Please fill all fields'); return }
    if (formData.password !== formData.confirm_password) { setError('Passwords do not match'); return }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const result = await supabaseApi.register(formData.email, formData.password, { full_name: formData.full_name, company: formData.company })
    if (result.success) {
      setSuccess(true)
      setTimeout(() => onRegister(), 2000)
    } else {
      setError(result.error || 'Registration failed')
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
          <h2>Create Account</h2>
          <p>Join the GEOLOGIX logistics network</p>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">✅ Account created! Redirecting...</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Full Name *</label><input type="text" name="full_name" placeholder="Your full name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} required /></div>
            <div className="form-group"><label>Email Address *</label><input type="email" name="email" placeholder="you@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
            <div className="form-group"><label>Company</label><input type="text" name="company" placeholder="Your company name" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} /></div>
            <div className="form-group"><label>Password *</label><input type="password" name="password" placeholder="Create a password (min 6 characters)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required /></div>
            <div className="form-group"><label>Confirm Password *</label><input type="password" name="confirm_password" placeholder="Confirm your password" value={formData.confirm_password} onChange={(e) => setFormData({...formData, confirm_password: e.target.value})} required /></div>
            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account →'}</button>
          </form>
          <p className="signup-link">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onLogin(); }}>Sign in</a></p>
        </div>
      </div>
    </div>
  )
}

export default Register
