'use client'

import AdminProducts from '@/pages/admin/AdminProducts'
import RequireAuth from '../RequireAuth'

export default function AdminProductsPage() {
  return (
    <RequireAuth>
      <AdminProducts />
    </RequireAuth>
  )
}