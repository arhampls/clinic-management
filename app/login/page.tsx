"use client"


import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { useEffect, useState, Suspense } from "react"

function LoginPageInner() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("")

  useEffect(() => {
    const msg = searchParams.get("message")
    if (msg) setMessage(decodeURIComponent(msg))
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        {message && <div className="mb-4 text-blue-600 text-center">{message}</div>}
        <LoginForm onShowRegister={() => {}} />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}
