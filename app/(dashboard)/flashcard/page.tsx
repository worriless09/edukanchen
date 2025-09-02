import { FlashcardSystem } from '@/components/flashcards/FlashcardSystem'

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <FlashcardSystem />
      </div>
    </div>
  )
}
