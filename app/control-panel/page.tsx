'use client'

import AdminStatistics from '@/pages/admin/AdminStatistics'
import RequireAuth from './RequireAuth'

export default function AdminStatisticsPage() {
  return (
    <RequireAuth>
      <AdminStatistics />
    </RequireAuth>
  )
}