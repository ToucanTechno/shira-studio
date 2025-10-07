'use client'

import AdminUsers from '@/views/admin/AdminUsers'
import RequireAuth from '../RequireAuth'

export default function AdminUsersPage() {
  return (
    <RequireAuth>
      <AdminUsers />
    </RequireAuth>
  )
}