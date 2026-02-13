import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { KISS_EMOJIS, TEXTS } from '../config.js'

export function KissesSection({ isVisible, triggerPosition }) {
  const [kisses, setKisses] = useState([])
  const [showPlan, setShowPlan] = useState(false)

  useEffect(() => {
    if (!isVisible || !triggerPosition) return

    const centerX = triggerPosition.x + triggerPosition.width / 2
    const centerY = triggerPosition.y + triggerPosition.height / 2

    const timeouts = []
    for (let i = 0; i < 60; i++) {
      const t = setTimeout(() => {
        const angle = (Math.PI * 2 * i) / 60 + Math.random()
        const dist = 120 + Math.random() * 250
        const x = centerX + Math.cos(angle) * dist + (Math.random() - 0.5) * 120
        const y = centerY + Math.sin(angle) * dist + (Math.random() - 0.5) * 120
        setKisses((prev) => [
          ...prev,
          {
            id: `kiss-${i}-${Math.random()}`,
            emoji: KISS_EMOJIS[Math.floor(Math.random() * KISS_EMOJIS.length)],
            x,
            y,
          },
        ])
      }, i * 25)
      timeouts.push(t)
    }

    const planTimer = setTimeout(() => setShowPlan(true), 1200)

    return () => {
      timeouts.forEach(clearTimeout)
      clearTimeout(planTimer)
    }
  }, [isVisible, triggerPosition])

  return (
    <motion.section
      id="kisses-section"
      className="kisses-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="kisses-container">
        {kisses.map((kiss) => (
          <KissParticle key={kiss.id} {...kiss} />
        ))}
      </div>

      {showPlan && (
        <motion.div
          className="date-plan"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        >
          <h2>{TEXTS.datePlanTitle}</h2>
          <ul>
            {TEXTS.datePlanItems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
          <motion.p
            className="date-signature"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {TEXTS.datePlanSignature}
          </motion.p>
        </motion.div>
      )}

      <style>{`
        .kisses-section {
          position: fixed;
          inset: 0;
          z-index: 30;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden;
        }

        .kisses-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .date-plan {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.96);
          padding: 40px;
          border-radius: 24px;
          max-width: 420px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
        }

        .date-plan h2 {
          font-family: 'Playfair Display', serif;
          color: var(--rose-deep);
          margin-bottom: 24px;
          font-size: 1.6rem;
          text-align: center;
        }

        .date-plan ul {
          list-style: none;
        }

        .date-plan li {
          padding: 14px 0;
          border-bottom: 1px solid rgba(233, 30, 99, 0.1);
          font-size: 1.2rem;
          color: var(--text-dark);
        }

        .date-plan li:last-of-type {
          border-bottom: none;
        }

        .date-signature {
          margin-top: 24px;
          text-align: center;
          font-size: 1.3rem;
          font-style: italic;
          color: var(--rose);
        }
      `}</style>
    </motion.section>
  )
}

function KissParticle({ id, emoji, x, y }) {
  return (
    <motion.span
      className="kiss"
      initial={{
        x,
        y,
        opacity: 1,
        scale: 0.5,
      }}
      animate={{
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        opacity: 0,
        scale: 1.3,
        rotate: 360,
      }}
      transition={{
        duration: 2.5,
        ease: 'easeOut',
      }}
      onAnimationComplete={() => {}}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        fontSize: '2rem',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {emoji}
    </motion.span>
  )
}
