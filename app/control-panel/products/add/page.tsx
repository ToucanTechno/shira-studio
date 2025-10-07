'use client'

import AdminProductsEdit from '@/views/admin/AdminProductsEdit'
import RequireAuth from '../../RequireAuth'

export default function AdminProductsAddPage() {
  return (
    <RequireAuth>
      <AdminProductsEdit />
    </RequireAuth>
  )
}