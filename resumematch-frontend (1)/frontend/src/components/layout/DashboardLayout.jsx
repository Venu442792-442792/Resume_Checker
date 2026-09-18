import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">{children}</main>
      </div>
    </div>
  )
}
