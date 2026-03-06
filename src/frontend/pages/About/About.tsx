import { Info, Zap, Target, TrendingUp, Award } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#e2b714]" />,
      title: 'Fast & Responsive',
      description:
        'Built with React and optimized for performance. No lag, no distractions.',
    },
    {
      icon: <Target className="w-6 h-6 text-[#e2b714]" />,
      title: 'Accurate Metrics',
      description:
        'Track your WPM, accuracy, consistency, and see detailed character statistics.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#e2b714]" />,
      title: 'Track Progress',
      description:
        'Monitor your improvement over time with detailed history and personal bests.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#e2b714]" />,
      title: 'Compete',
      description:
        'Compare your scores with others on the global leaderboard.',
    },
  ];

  const tips = [
    'Keep your wrists elevated and fingers curved over the home row',
    'Look at the screen, not your keyboard',
    'Use all ten fingers for optimal speed',
    'Practice regularly - consistency is key to improvement',
    'Focus on accuracy first, speed will come naturally',
    'Take breaks to avoid fatigue and maintain focus',
  ];

  return (
    <div className="flex-1 w-full flex flex-col items-center px-6 py-8 font-sans-swift animate-fade-in-up">
      <div className="w-full max-w-[850px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Info className="w-8 h-8 text-[#e2b714]" />
          <h1 className="text-4xl text-[#d1d0c5]">About SwiftType</h1>
        </div>

        {/* Introduction */}
        <div className="bg-[#2c2e31] rounded-lg p-8 border border-[#646669] border-opacity-20 mb-8">
          <h2 className="text-2xl text-[#d1d0c5] mb-4">What is SwiftType?</h2>
          <p className="text-[#646669] leading-relaxed mb-4">
            SwiftType is a minimalist typing speed test application inspired by Monkeytype.
            It's designed to help you measure and improve your typing speed and accuracy in a
            distraction-free environment.
          </p>
          <p className="text-[#646669] leading-relaxed">
            Whether you're a beginner learning touch typing or an experienced typist looking
            to improve, SwiftType provides the tools and metrics you need to track your
            progress and achieve your goals.
          </p>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-2xl text-[#d1d0c5] mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#2c2e31] rounded-lg p-6 border border-[#646669] border-opacity-20 hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#323437] rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-[#d1d0c5] font-medium mb-2">{feature.title}</h3>
                    <p className="text-[#646669] text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-[#2c2e31] rounded-lg p-8 border border-[#646669] border-opacity-20 mb-8">
          <h2 className="text-2xl text-[#d1d0c5] mb-4">How to Use</h2>
          <ol className="space-y-3 text-[#646669]">
            {[
              'Select your test mode (time, words, or custom) and configure options',
              'Click on the typing area or press any key to start the test',
              'Type the displayed text as quickly and accurately as possible',
              'View your results including WPM, accuracy, and performance graph',
              'Press Tab + Enter to restart and try again',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#e2b714] text-[#323437] rounded-full text-sm font-bold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Typing Tips */}
        <div className="bg-[#2c2e31] rounded-lg p-8 border border-[#646669] border-opacity-20">
          <h2 className="text-2xl text-[#d1d0c5] mb-4">Typing Tips</h2>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-[#646669]">
                <span className="flex-shrink-0 w-2 h-2 bg-[#e2b714] rounded-full mt-2" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
