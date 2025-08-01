"use client"

import { Github, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Developed by <span className="font-semibold text-gray-900">Silledif</span>, led by{" "}
            <span className="font-semibold text-gray-900">Arham Nadeem</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/arhampls/clinic-management"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              Source Code
            </a>

            <a
              href="mailto:silledif@gmail.com"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
