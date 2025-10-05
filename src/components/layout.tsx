import type { PropsWithChildren } from 'react'
import Header from './Header'

const Layout = ({children}: PropsWithChildren) => {
  return (
    <div className='bg-gradient-to-br from-background to-muted dark:from-background dark:to-muted'>
        <Header />
        <main className='min-h-screen container mx-auto px-4 py-8'>
        {children}
        </main>
        <footer className='border-t backdrop-blur py-2 supports-[backdrop-filter]:bg-background/50'>
            <div className='container mx-auto px-4 py-2 text-center text-muted-foreground'>
      <p>Crafted with ❤️ and a lot of ☕</p>
            </div>
        </footer>
        </div>
  )
}

export default Layout