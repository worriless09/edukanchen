'use client';
import { useState } from 'react';

interface AnalysisResult {
  relevanceScore: number;
  keyPoints: string[];
  relatedTopics: string[];
  studyRecommendations?: string[];
}

const CurrentAffairsAnalyzer = () => {
  const [newsText, setNewsText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeNews = async () => {
    if (!newsText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/labs/analyze-current-affairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newsText })
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing news:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left column: input */}
      <div className="w-1/2 p-6 border-r border-gray-200">
        <h2 className="text-xl font-semibold mb-4">News Article Input</h2>
        <textarea
          value={newsText}
          onChange={(e) => setNewsText(e.target.value)}
          className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste current affairs article here..."
        />
        <button
          onClick={analyzeNews}
          disabled={isAnalyzing || !newsText.trim()}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze for UPSC Relevance'}
        </button>
      </div>

      {/* Right column: results */}
      <div className="w-1/2 p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">UPSC Analysis</h2>

        {analysis && (
          <div className="space-y-6">
            {/* Relevance Score */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">
                Relevance Score: {analysis.relevanceScore}/10
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(analysis.relevanceScore / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Key Points */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Key Points for Revision:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {analysis.keyPoints?.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            {/* Related Topics */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Related UPSC Topics:</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.relatedTopics?.map((topic, idx) => (
                  <span
                    key={idx}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Study Recommendations */}
            {analysis.studyRecommendations?.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Study Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {analysis.studyRecommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!analysis && !isAnalyzing && (
          <div className="text-center text-gray-500 mt-20">
            Paste a news article and click "Analyze" to see UPSC relevance insights
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentAffairsAnalyzer;
