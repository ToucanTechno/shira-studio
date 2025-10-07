'use client'

import AdminStatistics from '@/views/admin/AdminStatistics'
import RequireAuth from './RequireAuth'

export default function AdminStatisticsPage() {
  return (
    <RequireAuth>
      <AdminStatistics />
    </RequireAuth>
  )
}