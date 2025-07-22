'use client'

import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'

export function Header() {
  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          {/* This part contains the logo, which we are keeping. */}
          <div className="flex items-center md:gap-x-12">
            <Link href="#" aria-label="Home">
              <Logo className="h-13 w-auto" />
            </Link>
          </div>

          {/* All the code for the navigation links and buttons that was here has been removed. */}
        </nav>
      </Container>
    </header>
  )
}
