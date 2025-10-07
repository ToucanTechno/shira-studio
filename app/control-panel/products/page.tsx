'use client'

import AdminProducts from '@/views/admin/AdminProducts'
import RequireAuth from '../RequireAuth'

export default function AdminProductsPage() {
  return (
    <RequireAuth>
      <AdminProducts />
    </RequireAuth>
  )
}