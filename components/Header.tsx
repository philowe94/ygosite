'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Mobile menu button - fixed top left */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white shadow-lg rounded-lg p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <Link href="/" className="text-2xl font-bold text-gray-900 mb-8 block" onClick={() => setIsMenuOpen(false)}>
                YgoSite
              </Link>
              <nav className="space-y-2">
                <Link
                  href="/"
                  className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/cards"
                  className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/cards') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cards
                </Link>
                <Link
                  href="/deckbuilder"
                  className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/deckbuilder') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deck Builder
                </Link>
                <Link
                  href="/about"
                  className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/about') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/contact') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive('/profile') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="block w-full text-left px-4 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/login') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm flex-col">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-gray-900 mb-8 block">
            YgoSite
          </Link>
          <nav className="space-y-2">
            <Link
              href="/"
              className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              href="/cards"
              className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/cards') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cards
            </Link>
            <Link
              href="/deckbuilder"
              className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/deckbuilder') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Deck Builder
            </Link>
            <Link
              href="/about"
              className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/about') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/contact') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Contact
            </Link>
            {session ? (
              <>
                <Link
                  href="/profile"
                  className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/profile') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left px-4 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/login') ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </aside>
    </>
  )
}