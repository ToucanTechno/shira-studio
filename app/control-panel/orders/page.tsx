'use client'

import AdminOrders from '@/pages/admin/AdminOrders'
import RequireAuth from '../RequireAuth'

export default function AdminOrdersPage() {
  return (
    <RequireAuth>
      <AdminOrders />
    </RequireAuth>
  )
}