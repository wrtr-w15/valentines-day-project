import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { TEXTS, SETTINGS } from '../config.js'

export function QuestionSection({ onYes }) {
  const [noRunCount, setNoRunCount] = useState(0)
  const [noPosition, setNoPosition] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const [overlayReady, setOverlayReady] = useState(false)
  const noBtnRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 400 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleNoHover = () => {
    if (noRunCount >= 5) return
    if (noRunCount === SETTINGS.warningAfter - 1) {
      setShowWarning(true)
      setNoRunCount(SETTINGS.warningAfter)
      return
    }
    if (noRunCount < SETTINGS.warningAfter) {
      moveNoButton()
    }
  }

  const moveNoButton = () => {
    const btn = noBtnRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const margin = 24
    const w = window.innerWidth
    const h = window.innerHeight
    const btnW = btn.offsetWidth
    const btnH = btn.offsetHeight

    const minX = margin
    const maxX = Math.max(minX, w - btnW - margin)
    const rangeX = Math.max(0, maxX - minX)

    const nextCount = noRunCount + 1
    let newX = minX + Math.random() * rangeX
    let newY

    if (h < 500) {
      const centerY = h / 2 - btnH / 2
      const band = Math.min(80, h * 0.25)
      newY = centerY + (Math.random() - 0.5) * band
    } else {
      const minY = margin
      const maxY = Math.max(minY, h - btnH - margin)
      newY = minY + Math.random() * Math.max(0, maxY - minY)
    }

    newY = Math.max(margin, Math.min(h - btnH - margin, newY))

    if (noRunCount === 0) {
      x.set(rect.left)
      y.set(rect.top)
    }

    setNoRunCount(nextCount)
    setNoPosition({ x: newX, y: newY })

    requestAnimationFrame(() => {
      x.set(newX)
      y.set(newY)
    })
  }

  useEffect(() => {
    if (showWarning) {
      setOverlayReady(false)
      const timer = setTimeout(() => setOverlayReady(true), SETTINGS.warningOverlayDelay)
      return () => clearTimeout(timer)
    }
  }, [showWarning])

  const dismissWarning = () => {
    setShowWarning(false)
    setOverlayReady(false)
    setNoRunCount(5)
    x.set(-9999)
    y.set(-9999)
  }

  const handleOverlayClick = () => {
    if (overlayReady) dismissWarning()
  }

  const noDisabled = noRunCount >= 5

  return (
    <motion.section
      id="question-section"
      className="question-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {TEXTS.question}
      </motion.h1>

      <div className="buttons-container">
        <motion.button
          id="yes-btn"
          className="valentine-btn yes"
          onClick={(e) => {
            const rect = e.currentTarget?.getBoundingClientRect()
            onYes(rect ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height } : null)
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
        >
          {TEXTS.yesButton}
        </motion.button>

        <motion.button
          ref={noBtnRef}
          id="no-btn"
          className="valentine-btn no"
          onMouseEnter={handleNoHover}
          onTouchStart={(e) => {
            if (!noDisabled) {
              e.preventDefault()
              handleNoHover()
            }
          }}
          style={
            noRunCount > 0
              ? {
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  x: xSpring,
                  y: ySpring,
                  pointerEvents: noDisabled ? 'none' : 'auto',
                }
              : {}
          }
          whileHover={!noRunCount ? { scale: 1.05 } : {}}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: noDisabled ? 0 : 1,
            scale: 1,
          }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
        >
          {TEXTS.noButton}
        </motion.button>
      </div>

      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="warning-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
            <motion.div
              className="warning-box"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="warning-text">{TEXTS.warningMessage}</p>
              <motion.button
                className="warning-btn"
                onClick={dismissWarning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {TEXTS.warningButton}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .question-section {
          position: fixed;
          inset: 0;
          display: flex;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 20;
          background: linear-gradient(
            135deg,
            #ffecd2 0%,
            #fcb69f 25%,
            #ff9a9e 50%,
            #fecfef 75%,
            #ffecd2 100%
          );
          background-size: 400% 400%;
          animation: gradientFlow 12s ease infinite;
        }

        .question-section h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          color: var(--text-dark);
          text-align: center;
          margin-bottom: 40px;
          line-height: 1.4;
          max-width: 400px;
        }

        .buttons-container {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
        }

        .valentine-btn {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          padding: 18px 40px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          user-select: none;
        }

        .valentine-btn.yes {
          background: linear-gradient(135deg, var(--rose) 0%, var(--rose-deep) 100%);
          color: white;
          box-shadow: 0 8px 30px rgba(233, 30, 99, 0.45);
        }

        .valentine-btn.no {
          background: rgba(255, 255, 255, 0.9);
          color: var(--text-dark);
          border: 2px solid var(--rose-light);
        }

        .warning-overlay {
          position: fixed;
          inset: 0;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }

        .warning-box {
          background: white;
          padding: 32px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          max-width: 320px;
        }

        .warning-text {
          font-size: 1.35rem;
          color: var(--text-dark);
          margin-bottom: 24px;
          line-height: 1.4;
        }

        .warning-btn {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          padding: 12px 32px;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, var(--rose) 0%, var(--rose-deep) 100%);
          color: white;
          cursor: pointer;
          font-weight: 600;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          user-select: none;
        }
      `}</style>
    </motion.section>
  )
}
