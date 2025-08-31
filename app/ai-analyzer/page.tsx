import { QuestionAnalyzer } from '@/components/QuestionAnalyzer'

export default function AIAnalyzerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Question Analyzer
            </h1>
            <p className="text-gray-600 text-lg">
              Get instant AI-powered analysis, difficulty ratings, and study recommendations 
              for any exam question
            </p>
          </div>
          <QuestionAnalyzer />
        </div>
      </div>
    </div>
  )
}
