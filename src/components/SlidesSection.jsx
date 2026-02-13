import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { SLIDES, TEXTS, SETTINGS } from '../config.js'

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 350 : -350,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 28,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -450 : 450,
    scale: 0.85,
    opacity: 0,
    rotate: direction > 0 ? -12 : 12,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 30,
    },
  }),
}

export function SlidesSection({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [showWrongSwipe, setShowWrongSwipe] = useState(false)

  const goNext = useCallback(() => {
    if (currentIndex >= SLIDES.length - 1) return
    setDirection(1)
    setCurrentIndex((prev) => prev + 1)
  }, [currentIndex])

  useEffect(() => {
    if (currentIndex === SLIDES.length - 1 && !isExiting) {
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => onComplete(), 600)
      }, SETTINGS.lastSlideDelaySeconds * 1000)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, isExiting, onComplete])

  const handleSwipedRight = useCallback(() => {
    setShowWrongSwipe(true)
  }, [])

  useEffect(() => {
    if (!showWrongSwipe) return
    const timer = setTimeout(() => setShowWrongSwipe(false), 1500)
    return () => clearTimeout(timer)
  }, [showWrongSwipe])

  const handlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: handleSwipedRight,
    trackMouse: true,
    preventScrollOnSwipe: true,
  })

  const handleClick = () => {
    if (currentIndex === SLIDES.length - 1) return
    goNext()
  }

  const currentSlide = SLIDES[currentIndex]

  return (
    <motion.section
      id="slides-section"
      className="slides-section"
      initial={false}
      animate={isExiting ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div
        {...handlers}
        className="slides-container"
        onClick={handleClick}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="slide-card"
          >
            <img src={currentSlide.src} alt={currentSlide.alt} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="slide-indicator">
        {SLIDES.map((_, i) => (
          <motion.span
            key={i}
            className={`dot ${i === currentIndex ? 'active' : ''}`}
            animate={{
              scale: i === currentIndex ? 1.2 : 1,
              opacity: i === currentIndex ? 1 : 0.5,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
        ))}
      </div>

      <motion.p
        className="swipe-hint"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {TEXTS.slideHints[currentIndex]}
      </motion.p>

      <AnimatePresence>
        {showWrongSwipe && (
          <motion.div
            className="wrong-swipe-wrapper"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className="wrong-swipe-hint">{TEXTS.wrongSwipeHint}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .slides-section {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .slides-container {
          position: relative;
          width: 90%;
          max-width: 420px;
          height: 55vh;
          max-height: 520px;
          border-radius: 24px;
          overflow: visible;
          cursor: pointer;
          touch-action: pan-y pinch-zoom;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          user-select: none;
        }

        .slide-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          box-shadow: 
            0 25px 50px -12px rgba(233, 30, 99, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          will-change: transform;
        }

        .slide-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        .slide-indicator {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--rose);
          box-shadow: 0 0 12px rgba(233, 30, 99, 0.4);
        }

        .swipe-hint {
          margin-top: 16px;
          font-size: 1.05rem;
          color: var(--text-dark);
        }

        .wrong-swipe-wrapper {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 50;
        }

        .wrong-swipe-hint {
          font-size: 1.1rem;
          color: var(--rose-deep);
          background: rgba(255, 255, 255, 0.95);
          padding: 10px 24px;
          border-radius: 50px;
          box-shadow: 0 4px 20px rgba(233, 30, 99, 0.25);
        }
      `}</style>
    </motion.section>
  )
}
