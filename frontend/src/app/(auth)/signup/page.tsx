'use client'

import React, { useState } from 'react'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const SignUp = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isloading, setIsLoading] = useState(false)
  const router  = useRouter();
  const { fetchUser } = useAuthStore()

  const handleSignup = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {data} = await api.post('/signup', {
        name,
        email,
        password
      })

      localStorage.setItem('token', data.token)

      await fetchUser()

      toast.success('account successfully created!');
      router.push('/dashboard')

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'signup failed!')
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <>
      <div className='min-h-screen flex justify-center items-center px-10'>
        <div>
          <h2 className='text-center font-semibold text-3xl'>Sign Up</h2>
          <form action="" className='my-5' onSubmit={handleSignup}>
            <input 
              type="text" 
              className='border w-full py-2 px-3 rounded-l-full rounded-r-full mb-3'
              placeholder='name'
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              type="email" 
              className='border w-full py-2 px-3 rounded-l-full rounded-r-full mb-3'
              placeholder='example@gmail.com'
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              className='border w-full py-2 px-3 rounded-l-full rounded-r-full mb-3'
              placeholder='password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='flex justify-center'>
              <button 
                disabled={isloading}
                className="font-semibold px-10 py-3 bg-blue-500 rounded-full disabled:opacity-50"
              >
                {isloading? 'Signing In ... ' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp