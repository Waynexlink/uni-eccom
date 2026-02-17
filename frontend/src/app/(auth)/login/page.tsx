'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

const LoginPage = () => {

  const { fetchUser } = useAuthStore()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isloading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)

    try {
      const { data } = await api.post('/login', {email, password});
      localStorage.setItem('token', data.token);

      await fetchUser()

      toast.success('Welcome!')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error('Login Failed!')
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen px-10'>
      <form action="" onSubmit={handleLogin}>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-3 py-2 mb-2 bg-white border rounded-r-full rounded-l-full'
          placeholder='Email'
        />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full px-3 py-2 bg-white border rounded-r-full rounded-l-full'
          placeholder='Password'
        />
        <div className='flex justify-center'>
          <button className='px-10 py-3 mt-2 bg-blue-500 rounded-r-full rounded-l-full'>
            {isloading? 'Loging in ...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage