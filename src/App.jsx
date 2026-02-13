import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SlidesSection } from './components/SlidesSection'
import { QuestionSection } from './components/QuestionSection'
import { KissesSection } from './components/KissesSection'

export default function App() {
  const [phase, setPhase] = useState('slides')
  const [kissOrigin, setKissOrigin] = useState(null)

  const handleSlidesComplete = () => {
    setPhase('question')
  }

  const handleYes = (rect) => {
    setKissOrigin(rect || { x: window.innerWidth / 2, y: window.innerHeight / 2, width: 0, height: 0 })
    setPhase('kisses')
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'slides' && (
          <SlidesSection key="slides" onComplete={handleSlidesComplete} />
        )}

        {phase === 'question' && (
          <QuestionSection
            key="question"
            onYes={handleYes}
            onNo={() => {}}
          />
        )}
      </AnimatePresence>

      <KissesSection
        isVisible={phase === 'kisses'}
        triggerPosition={kissOrigin}
      />
    </>
  )
}
