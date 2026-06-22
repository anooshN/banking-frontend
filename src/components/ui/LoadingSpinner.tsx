import React from 'react'

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary"></div>
  </div>
)

export default LoadingSpinner
