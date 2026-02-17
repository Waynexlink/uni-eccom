'use client'
import ProtectedRoute from '@/components/ProtectedRoute'

const DashboardContent = () => {
  return (
    <div>
      Dashboard
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}