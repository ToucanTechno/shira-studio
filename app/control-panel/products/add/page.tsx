'use client'

import AdminProductsEdit from '@/pages/admin/AdminProductsEdit'
import RequireAuth from '../../RequireAuth'

export default function AdminProductsAddPage() {
  return (
    <RequireAuth>
      <AdminProductsEdit />
    </RequireAuth>
  )
}