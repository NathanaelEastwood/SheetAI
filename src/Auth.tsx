import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient('https://zjjwdvfawzxdyvwtpafp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqandkdmZhd3p4ZHl2d3RwYWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MjMyMzUsImV4cCI6MjA1NzI5OTIzNX0.i9vOaUB3k252qAsxMaCcV965GQ3ZcQl_4rQBrzsrWo8')

interface SupabaseAuthProps {
  children: React.ReactNode;
}

const SupabaseAuth: React.FC<SupabaseAuthProps> = ({ children }) => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
  }
  
  return <>{children}</>
}

export default SupabaseAuth
export { supabase }