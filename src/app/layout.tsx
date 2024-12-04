import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})

export const metadata = {
  title: 'CGM App',
  description: 'Aplikasi Web Perum Cipta Graha Mandiri',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.className}>
      <body className='bg-gray-100 bg-opacity-50'>
        {children}
      </body>
    </html>
  )
}