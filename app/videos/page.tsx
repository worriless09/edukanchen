import { VideoUploader } from '@/components/video-upload/VideoUploader'
import { VideoLibrary } from '@/components/video-upload/VideoLibrary'

export default function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Video Learning Center
          </h1>
          <p className="text-gray-600 text-lg">
            Upload, manage, and watch educational videos for your exam preparation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <VideoUploader />
          </div>
          <div>
            <VideoLibrary />
          </div>
        </div>
      </div>
    </div>
  )
}
