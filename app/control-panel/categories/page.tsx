'use client'

import AdminCategories from '@/views/admin/AdminCategories'
import RequireAuth from '../RequireAuth'

export default function AdminCategoriesPage() {
  return (
    <RequireAuth>
      <AdminCategories />
    </RequireAuth>
  )
}