import { AlertTriangle } from 'lucide-react'

export default function ServerDown() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Server is down</h1>
        <p className="mb-8 text-lg text-gray-600">
          We&apos;re experiencing some technical difficulties. Our team has been notified and is working to get things
          back up and running as soon as possible.
        </p>
        <div className="mt-12 text-sm text-gray-500">
          If the problem persists, please contact support at{' '}
          <a href="mailto:support@example.com" className="font-medium text-blue-600 hover:text-blue-500">
            support@tun9.com
          </a>
        </div>
      </div>
    </div>
  )
}
