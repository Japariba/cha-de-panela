import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--cream)' }}>
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
    </div>
  )
}
