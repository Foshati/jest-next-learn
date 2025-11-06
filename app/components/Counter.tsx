'use client'

import { useState } from 'react'

interface CounterProps {
  initialValue?: number
  step?: number
  onCountChange?: (count: number) => void
}

export default function Counter({ 
  initialValue = 0, 
  step = 1,
  onCountChange 
}: CounterProps) {
  const [count, setCount] = useState(initialValue)

  const increment = () => {
    const newCount = count + step
    setCount(newCount)
    onCountChange?.(newCount)
  }

  const decrement = () => {
    const newCount = count - step
    setCount(newCount)
    onCountChange?.(newCount)
  }

  const reset = () => {
    setCount(initialValue)
    onCountChange?.(initialValue)
  }

  return (
    <div className="counter" data-testid="counter">
      <h2>Counter: {count}</h2>
      <div className="counter-buttons">
        <button onClick={decrement} aria-label="Decrement">
          -
        </button>
        <button onClick={reset} aria-label="Reset">
          Reset
        </button>
        <button onClick={increment} aria-label="Increment">
          +
        </button>
      </div>
      <p className="counter-info">
        Step: {step} | Initial: {initialValue}
      </p>
    </div>
  )
}

