import RegisterForm from '@/components/auth/registerForm'
import React from 'react'

type Props = {}

const SignUp = (props: Props) => {
  return (
    <div className='w-full flex items-center justify-center mt-10'>
        <RegisterForm/>
    </div>
  )
}

export default SignUp