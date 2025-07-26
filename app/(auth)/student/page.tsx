'use client'

import StudentLogin from '../components/studentLogin'
import StudentSignup from '../components/studentSignup'
import { useState } from 'react'

export default function Student() {
  const [isSignin, setIsSignin] = useState<boolean>(true)

  return (
    <div>
      {isSignin ? (
        <StudentLogin isSignin={isSignin} setIsSignin={setIsSignin} />
      ) : (
        <StudentSignup isSignin={isSignin} setIsSignin={setIsSignin} />
      )}
    </div>
  )
}
