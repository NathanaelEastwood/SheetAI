import { useState } from 'react';
import { supabase } from './Auth';
import styled from 'styled-components';
import { Session } from '@supabase/supabase-js';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #e9ecef;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #80bdff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
  }
`;

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
    <FormContainer>
      <Form onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => {
          setEmail(e.target.value);
          setErrorMessage(null);
        }} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => {
          setPassword(e.target.value);
          setErrorMessage(null);
        }} required />
        <Button type="submit">Sign Up</Button>
        <p>Already have an account? <a href="#" onClick={() => onSignupSuccess(null)}>Login</a></p>
      </Form>
    </FormContainer>
  );
};

export default Signup; 