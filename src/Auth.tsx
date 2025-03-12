import { useState, useEffect } from 'react'
import { createClient, Session } from '@supabase/supabase-js'
import styled from 'styled-components'

const supabase = createClient('https://zjjwdvfawzxdyvwtpafp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqandkdmZhd3p4ZHl2d3RwYWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MjMyMzUsImV4cCI6MjA1NzI5OTIzNX0.i9vOaUB3k252qAsxMaCcV965GQ3ZcQl_4rQBrzsrWo8')

interface SupabaseAuthProps {
  children: React.ReactNode;
}

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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const SupabaseAuth: React.FC<SupabaseAuthProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as Session | null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as Session | null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) console.error('Error logging in:', error.message)
  }

  if (!session) {
    return (
      <FormContainer>
        <Form onSubmit={handleLogin}>
          <h2>Login</h2>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit">Login</Button>
        </Form>
      </FormContainer>
    )
  }
  
  return <>{children}</>
}

export default SupabaseAuth
export { supabase }