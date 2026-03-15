'use client'

import { useState } from 'react'
import ImageAuthLayout from '../components/image-auth-layout'
import StudentLogin from '../components/student-login'
import StudentSignup from '../components/student-signup'

export default function StudentPage() {
  const [isSignin, setIsSignin] = useState<boolean>(true)

  return (
    <ImageAuthLayout mode="student">
      {isSignin ? (
        <StudentLogin setIsSignin={setIsSignin} />
      ) : (
        <StudentSignup setIsSignin={setIsSignin} />
      )}
    </ImageAuthLayout>
  )
}
