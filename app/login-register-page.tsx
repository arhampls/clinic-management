"use client";

import { useState } from "react";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import { Footer } from "@/components/footer";

export default function LoginRegisterPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {showRegister ? (
          <RegisterForm onBackToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onShowRegister={() => setShowRegister(true)} />
        )}
      </div>
      <Footer />
    </div>
  );
}
