"use client"


import { useSearchParams } from "next/navigation"

import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Footer } from "@/components/footer"
import { useEffect, useState, Suspense } from "react"



function LoginPageContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) setMessage(decodeURIComponent(msg));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {message && <div className="mb-4 text-blue-600 text-center">{message}</div>}
          {showRegister ? (
            <RegisterForm onBackToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onShowRegister={() => setShowRegister(true)} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  )
}
