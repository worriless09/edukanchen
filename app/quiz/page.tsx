import { PYQQuizSystem } from '@/components/quiz/PYQQuizSystem'

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <PYQQuizSystem />
      </div>
    </div>
  )
}
