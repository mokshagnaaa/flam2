import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <h1>Performance Dashboard</h1>
      {children}
    </div>
  )
}
