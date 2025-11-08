import './globals.css'

export const metadata = {
  title: 'Performance Dashboard',
  description: 'High-performance real-time charts sample'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
