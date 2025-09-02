import { MaterialsUpload } from '@/components/study-materials/MaterialsUpload'
import { MaterialsLibrary } from '@/components/study-materials/MaterialsLibrary'

export default function StudyMaterialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Study Materials Hub
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Upload your notes, PDFs, and documents. Our AI will help you create 
              quizzes, flashcards, and study guides automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MaterialsUpload />
            </div>
            <div>
              <MaterialsLibrary />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
