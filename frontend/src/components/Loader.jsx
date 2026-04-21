import { Loader2 } from 'lucide-react'

const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 text-primary animate-spin" />
    </div>
  )
}

export default Loader