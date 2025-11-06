/**
 * مثال جامع Jest برای یادگیری تست در Next.js
 * این فایل شامل انواع مختلف تست‌ها است
 */

import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Counter from './Counter'

describe('Counter Component - مثال‌های Jest', () => {
  // ============================================
  // 1. تست‌های پایه - Basic Tests
  // ============================================
  describe('1. تست‌های رندر اولیه', () => {
    it('باید کامپوننت را رندر کند', () => {
      render(<Counter />)
      expect(screen.getByTestId('counter')).toBeInTheDocument()
    })

    it('باید مقدار اولیه 0 را نمایش دهد', () => {
      render(<Counter />)
      expect(screen.getByText('Counter: 0')).toBeInTheDocument()
    })

    it('باید مقدار اولیه سفارشی را نمایش دهد', () => {
      render(<Counter initialValue={10} />)
      expect(screen.getByText('Counter: 10')).toBeInTheDocument()
    })

    it('باید اطلاعات step و initial را نمایش دهد', () => {
      render(<Counter initialValue={5} step={2} />)
      expect(screen.getByText(/Step: 2/)).toBeInTheDocument()
      expect(screen.getByText(/Initial: 5/)).toBeInTheDocument()
    })
  })

  // ============================================
  // 2. تست‌های تعامل کاربر - User Interactions
  // ============================================
  describe('2. تست‌های کلیک و تعامل', () => {
    it('باید با کلیک روی دکمه + مقدار را افزایش دهد', () => {
      render(<Counter />)
      const incrementButton = screen.getByLabelText('Increment')
      
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 1')).toBeInTheDocument()
      
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 2')).toBeInTheDocument()
    })

    it('باید با کلیک روی دکمه - مقدار را کاهش دهد', () => {
      render(<Counter initialValue={5} />)
      const decrementButton = screen.getByLabelText('Decrement')
      
      fireEvent.click(decrementButton)
      expect(screen.getByText('Counter: 4')).toBeInTheDocument()
    })

    it('باید با کلیک روی Reset مقدار را به مقدار اولیه برگرداند', () => {
      render(<Counter initialValue={10} />)
      const incrementButton = screen.getByLabelText('Increment')
      const resetButton = screen.getByLabelText('Reset')
      
      // افزایش مقدار
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 12')).toBeInTheDocument()
      
      // بازگشت به مقدار اولیه
      fireEvent.click(resetButton)
      expect(screen.getByText('Counter: 10')).toBeInTheDocument()
    })

    it('باید step را در محاسبات اعمال کند', () => {
      render(<Counter initialValue={0} step={5} />)
      const incrementButton = screen.getByLabelText('Increment')
      
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 5')).toBeInTheDocument()
      
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 10')).toBeInTheDocument()
    })
  })

  // ============================================
  // 3. تست‌های Callback - Callback Tests
  // ============================================
  describe('3. تست‌های Callback و Props', () => {
    it('باید callback را هنگام تغییر مقدار فراخوانی کند', () => {
      const mockCallback = jest.fn()
      render(<Counter onCountChange={mockCallback} />)
      
      const incrementButton = screen.getByLabelText('Increment')
      fireEvent.click(incrementButton)
      
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith(1)
    })

    it('باید callback را با مقدار صحیح فراخوانی کند', () => {
      const mockCallback = jest.fn()
      render(<Counter initialValue={10} step={3} onCountChange={mockCallback} />)
      
      const incrementButton = screen.getByLabelText('Increment')
      fireEvent.click(incrementButton)
      
      expect(mockCallback).toHaveBeenCalledWith(13)
    })

    it('باید callback را هنگام reset فراخوانی کند', () => {
      const mockCallback = jest.fn()
      render(<Counter initialValue={5} onCountChange={mockCallback} />)
      
      const incrementButton = screen.getByLabelText('Increment')
      const resetButton = screen.getByLabelText('Reset')
      
      fireEvent.click(incrementButton)
      fireEvent.click(resetButton)
      
      expect(mockCallback).toHaveBeenCalledTimes(2)
      expect(mockCallback).toHaveBeenLastCalledWith(5)
    })
  })

  // ============================================
  // 4. تست‌های چندگانه - Multiple Interactions
  // ============================================
  describe('4. تست‌های تعاملات پیچیده', () => {
    it('باید چندین عملیات را به ترتیب انجام دهد', () => {
      render(<Counter initialValue={0} step={2} />)
      const incrementButton = screen.getByLabelText('Increment')
      const decrementButton = screen.getByLabelText('Decrement')
      
      // +2, +2, -2, +2
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 2')).toBeInTheDocument()
      
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 4')).toBeInTheDocument()
      
      fireEvent.click(decrementButton)
      expect(screen.getByText('Counter: 2')).toBeInTheDocument()
      
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 4')).toBeInTheDocument()
    })

    it('باید با مقادیر منفی کار کند', () => {
      render(<Counter initialValue={0} />)
      const decrementButton = screen.getByLabelText('Decrement')
      
      fireEvent.click(decrementButton)
      expect(screen.getByText('Counter: -1')).toBeInTheDocument()
      
      fireEvent.click(decrementButton)
      expect(screen.getByText('Counter: -2')).toBeInTheDocument()
    })
  })

  // ============================================
  // 5. تست‌های Accessibility - A11y Tests
  // ============================================
  describe('5. تست‌های دسترسی (Accessibility)', () => {
    it('باید دکمه‌ها دارای aria-label باشند', () => {
      render(<Counter />)
      
      expect(screen.getByLabelText('Increment')).toBeInTheDocument()
      expect(screen.getByLabelText('Decrement')).toBeInTheDocument()
      expect(screen.getByLabelText('Reset')).toBeInTheDocument()
    })

    it('باید دکمه‌ها قابل کلیک باشند', () => {
      render(<Counter />)
      
      const incrementButton = screen.getByLabelText('Increment')
      expect(incrementButton).not.toBeDisabled()
    })
  })

  // ============================================
  // 6. تست‌های Edge Cases
  // ============================================
  describe('6. تست‌های حالت‌های خاص', () => {
    it('باید با initialValue منفی کار کند', () => {
      render(<Counter initialValue={-10} />)
      expect(screen.getByText('Counter: -10')).toBeInTheDocument()
    })

    it('باید با step بزرگ کار کند', () => {
      render(<Counter initialValue={0} step={100} />)
      const incrementButton = screen.getByLabelText('Increment')
      
      fireEvent.click(incrementButton)
      expect(screen.getByText('Counter: 100')).toBeInTheDocument()
    })

    it('باید بدون callback کار کند', () => {
      render(<Counter />)
      const incrementButton = screen.getByLabelText('Increment')
      
      // نباید خطا بدهد
      expect(() => {
        fireEvent.click(incrementButton)
      }).not.toThrow()
    })
  })
})

