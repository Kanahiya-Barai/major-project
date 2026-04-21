import { useState, useEffect } from 'react'
import { adminService } from '../../services/admin'
import SkeletonLoader from '../../components/SkeletonLoader'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'

const Users = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  useEffect(() => {
    adminService.getUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const handleAction = (action, userId) => {
    alert(`${action} user ${userId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage platform users</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition">
          Add User
        </button>
      </div>

      {loading ? (
        <SkeletonLoader type="table" count={10} />
      ) : (
        <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-success bg-success/10 px-2 py-1 rounded-full text-xs">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction('Edit', user.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction('Delete', user.id)}
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Users