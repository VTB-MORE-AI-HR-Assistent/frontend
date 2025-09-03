// Phase 1: Basic loading state
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F8C] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading interview session...</p>
      </div>
    </div>
  )
}