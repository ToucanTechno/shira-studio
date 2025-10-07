'use client'

import AdminProductsEdit from '@/views/admin/AdminProductsEdit'
import RequireAuth from '../../../RequireAuth'

export default function AdminProductsEditPage() {
  return (
    <RequireAuth>
      <AdminProductsEdit />
    </RequireAuth>
  )
}