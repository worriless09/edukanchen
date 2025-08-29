import QuestionAnalyzer from '@/components/QuestionAnalyzer';

export default function AIAnalyzerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI-Powered Question Analysis
          </h1>
          <p className="text-gray-600">
            Get detailed analysis and spaced repetition scheduling for your exam preparation
          </p>
        </div>
        <QuestionAnalyzer />
      </div>
    </div>
  );
}