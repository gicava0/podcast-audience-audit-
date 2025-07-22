import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'

export function Footer() {
  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-16">
          <Logo className="mx-auto h-10 w-auto" />
          {/* The navigation links that were here have been removed. */}
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          {/* The social media links that were here have been removed. */}
          <p className="text-sm text-slate-500 text-center">
            Copyright &copy; 2025 Resonant Media PTY LTD. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
