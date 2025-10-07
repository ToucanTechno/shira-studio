'use client'

import AdminCategories from '@/pages/admin/AdminCategories'
import RequireAuth from '../RequireAuth'

export default function AdminCategoriesPage() {
  return (
    <RequireAuth>
      <AdminCategories />
    </RequireAuth>
  )
}