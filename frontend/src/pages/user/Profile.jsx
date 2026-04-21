import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { User, Mail, Shield } from 'lucide-react'

const Profile = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
      <p className="text-gray-600 mb-8">Manage your account settings.</p>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Shield className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile