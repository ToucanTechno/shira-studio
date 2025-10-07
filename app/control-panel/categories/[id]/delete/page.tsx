'use client'

import AdminCategoriesDelete from '@/views/admin/AdminCategoriesDelete'
import RequireAuth from '../../../RequireAuth'

export default function AdminCategoriesDeletePage() {
  return (
    <RequireAuth>
      <AdminCategoriesDelete />
    </RequireAuth>
  )
}