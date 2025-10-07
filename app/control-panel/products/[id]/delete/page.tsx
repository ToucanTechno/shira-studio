'use client'

import AdminProductsDelete from '@/pages/admin/AdminProductsDelete'
import RequireAuth from '../../../RequireAuth'

export default function AdminProductsDeletePage() {
  return (
    <RequireAuth>
      <AdminProductsDelete />
    </RequireAuth>
  )
}