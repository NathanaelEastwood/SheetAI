import { useState } from 'react';
import { supabase } from './Auth';
import { Session } from '@supabase/supabase-js';

interface SignupProps {
  onSignupSuccess: (session: Session | null) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error signing up:', error.message);
      setErrorMessage(error.message);
    } else {
      onSignupSuccess(data.session);
    }
  };

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
      <form onSubmit={handleSignup} style={{
        display: 'flex',
        flexDirection: 'column',
        width: '320px',
        padding: '30px',
        backgroundColor: '#ffffff',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px'
      }}>
        <h2>Sign Up</h2>
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
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease, transform 0.2s ease'
        }}>Sign Up</button>
        <p>Already have an account? <a href="#" onClick={() => onSignupSuccess(null)}>Login</a></p>
      </form>
    </div>
  );
};

export default Signup; 