'use client'
import { useState } from 'react'
import InstructorLogin from '../components/instructorLogin'
import InstructorSignup from '../components/instructorSignup'

export default function Instructor() {
  const [isSignin, setIsSignin] = useState<boolean>(true)

  return (
    <div>
      {isSignin ? (
        <InstructorLogin isSignin={isSignin} setIsSignin={setIsSignin} />
      ) : (
        <InstructorSignup isSignin={isSignin} setIsSignin={setIsSignin} />
      )}
    </div>
  )
}
