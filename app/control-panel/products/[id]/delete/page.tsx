'use client'

import AdminProductsDelete from '@/views/admin/AdminProductsDelete'
import RequireAuth from '../../../RequireAuth'

export default function AdminProductsDeletePage() {
  return (
    <RequireAuth>
      <AdminProductsDelete />
    </RequireAuth>
  )
}