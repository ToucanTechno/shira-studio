'use client'

import AdminUsers from '@/pages/admin/AdminUsers'
import RequireAuth from '../RequireAuth'

export default function AdminUsersPage() {
  return (
    <RequireAuth>
      <AdminUsers />
    </RequireAuth>
  )
}