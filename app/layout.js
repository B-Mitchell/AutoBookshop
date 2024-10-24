import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'Automated Bookshop',
  description: 'Built by BigMitch',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body >
            <Navbar />
            <div className="user-container">
              {children}
            </div>
        </body>
      </html>
    </ClerkProvider>
  )
}

