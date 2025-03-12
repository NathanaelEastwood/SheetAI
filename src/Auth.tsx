import { useState, useEffect } from 'react'
import { createClient, Session } from '@supabase/supabase-js'
import Signup from './Signup'
import { useNavigate } from 'react-router-dom'

const supabase = createClient('https://zjjwdvfawzxdyvwtpafp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqandkdmZhd3p4ZHl2d3RwYWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MjMyMzUsImV4cCI6MjA1NzI5OTIzNX0.i9vOaUB3k252qAsxMaCcV965GQ3ZcQl_4rQBrzsrWo8')

const SupabaseAuth: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setErrorMessage(null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as Session | null);
      if (session) {
        navigate('/App');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      if (session) {
        navigate('/App');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Error logging in:', error.message)
      setErrorMessage(error.message)
    } else {
      navigate('/App')
    }
  }

  if (!session) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#e9ecef',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {isLogin ? (
          <form onSubmit={handleLogin} style={{
            display: 'flex',
            flexDirection: 'column',
            width: '320px',
            padding: '30px',
            backgroundColor: '#ffffff',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px'
          }}>
            <h2>Login</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setErrorMessage(null);
            }} required style={{
              marginBottom: '15px',
              padding: '12px',
              border: '1px solid #ced4da',
              borderRadius: '5px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }} />
            <input type="password" placeholder="Password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setErrorMessage(null);
            }} required style={{
              marginBottom: '15px',
              padding: '12px',
              border: '1px solid #ced4da',
              borderRadius: '5px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }} />
            <button type="submit" style={{
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s ease'
            }}>Login</button>
            <p>Don't have an account? <a href="#" onClick={toggleAuthMode}>Sign Up</a></p>
          </form>
        ) : (
          <Signup onSignupSuccess={(session) => {
            setSession(session);
            setIsLogin(true);
            navigate('/App');
          }} />
        )}
      </div>
    )
  }
  
  return null;
}

export default SupabaseAuth
export { supabase }