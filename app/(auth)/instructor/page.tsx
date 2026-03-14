'use client'

import { useState } from 'react'
import ImageAuthLayout from '../components/image-auth-layout'
import InstructorLogin from '../components/instructor-login'
import InstructorSignup from '../components/instructor-signup'

export default function InstructorPage() {
  const [isSignin, setIsSignin] = useState<boolean>(true)

  return (
    <ImageAuthLayout mode="instructor">
      {isSignin ? (
        <InstructorLogin setIsSignin={setIsSignin} />
      ) : (
        <InstructorSignup setIsSignin={setIsSignin} />
      )}
    </ImageAuthLayout>
  )
}
