/**
 * مثال پیشرفته‌تر Jest - تست TodoList
 * شامل تست‌های async، form handling، و state management
 */

import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from './TodoList'

describe('TodoList Component - مثال پیشرفته Jest', () => {
  // ============================================
  // 1. تست‌های اولیه
  // ============================================
  describe('1. رندر اولیه', () => {
    it('باید کامپوننت را رندر کند', () => {
      render(<TodoList />)
      expect(screen.getByTestId('todo-list')).toBeInTheDocument()
    })

    it('باید پیام خالی را نمایش دهد وقتی todo وجود ندارد', () => {
      render(<TodoList />)
      expect(screen.getByTestId('empty-message')).toBeInTheDocument()
      expect(screen.getByText(/No todos yet/)).toBeInTheDocument()
    })

    it('باید input و دکمه Add را نمایش دهد', () => {
      render(<TodoList />)
      expect(screen.getByTestId('todo-input')).toBeInTheDocument()
      expect(screen.getByTestId('add-todo-button')).toBeInTheDocument()
    })
  })

  // ============================================
  // 2. تست‌های افزودن Todo
  // ============================================
  describe('2. افزودن Todo', () => {
    it('باید todo جدید اضافه کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      await user.type(input, 'Learn Jest')
      await user.click(addButton)
      
      expect(screen.getByText('Learn Jest')).toBeInTheDocument()
      expect(input).toHaveValue('')
    })

    it('باید todo را با Enter اضافه کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      await user.type(input, 'Test with Enter{Enter}')
      
      expect(screen.getByText('Test with Enter')).toBeInTheDocument()
    })

    it('نباید todo خالی اضافه کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const addButton = screen.getByTestId('add-todo-button')
      await user.click(addButton)
      
      expect(screen.getByTestId('empty-message')).toBeInTheDocument()
    })

    it('باید فاصله‌های اضافی را حذف کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      await user.type(input, '   Trimmed Todo   ')
      await user.click(addButton)
      
      expect(screen.getByText('Trimmed Todo')).toBeInTheDocument()
    })
  })

  // ============================================
  // 3. تست‌های Toggle Todo
  // ============================================
  describe('3. تغییر وضعیت Todo', () => {
    it('باید todo را کامل/ناقص کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      await user.type(input, 'Complete me')
      await user.click(addButton)
      
      const todoText = screen.getByText('Complete me')
      const checkbox = screen.getByTestId(/todo-checkbox-/)
      
      expect(todoText).not.toHaveStyle({ textDecoration: 'line-through' })
      
      await user.click(checkbox)
      
      expect(todoText).toHaveStyle({ textDecoration: 'line-through' })
    })

    it('باید کلاس completed را اضافه کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      await user.type(input, 'Test class')
      await user.click(addButton)
      
      const todoItem = screen.getByTestId(/todo-item-/)
      const checkbox = screen.getByTestId(/todo-checkbox-/)
      
      expect(todoItem).not.toHaveClass('completed')
      
      await user.click(checkbox)
      
      expect(todoItem).toHaveClass('completed')
    })
  })

  // ============================================
  // 4. تست‌های حذف Todo
  // ============================================
  describe('4. حذف Todo', () => {
    it('باید todo را حذف کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      await user.type(input, 'Delete me')
      await user.click(addButton)
      
      expect(screen.getByText('Delete me')).toBeInTheDocument()
      
      const deleteButton = screen.getByTestId(/delete-todo-/)
      await user.click(deleteButton)
      
      expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
      expect(screen.getByTestId('empty-message')).toBeInTheDocument()
    })

    it('باید todo صحیح را حذف کند وقتی چند todo وجود دارد', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      await user.type(input, 'Todo 1')
      await user.click(addButton)
      
      await user.type(input, 'Todo 2')
      await user.click(addButton)
      
      await user.type(input, 'Todo 3')
      await user.click(addButton)
      
      expect(screen.getByText('Todo 1')).toBeInTheDocument()
      expect(screen.getByText('Todo 2')).toBeInTheDocument()
      expect(screen.getByText('Todo 3')).toBeInTheDocument()
      
      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[1]) // حذف Todo 2
      
      expect(screen.getByText('Todo 1')).toBeInTheDocument()
      expect(screen.queryByText('Todo 2')).not.toBeInTheDocument()
      expect(screen.getByText('Todo 3')).toBeInTheDocument()
    })
  })

  // ============================================
  // 5. تست‌های آمار
  // ============================================
  describe('5. آمار Todo', () => {
    it('باید آمار صحیح را نمایش دهد', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      // اضافه کردن 3 todo
      await user.type(input, 'Todo 1')
      await user.click(addButton)
      
      await user.type(input, 'Todo 2')
      await user.click(addButton)
      
      await user.type(input, 'Todo 3')
      await user.click(addButton)
      
      expect(screen.getByText(/Total: 3/)).toBeInTheDocument()
      expect(screen.getByText(/Completed: 0/)).toBeInTheDocument()
      expect(screen.getByText(/Remaining: 3/)).toBeInTheDocument()
    })

    it('باید آمار را بعد از complete کردن به‌روز کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      await user.type(input, 'Todo 1')
      await user.click(addButton)
      
      await user.type(input, 'Todo 2')
      await user.click(addButton)
      
      const checkboxes = screen.getAllByTestId(/todo-checkbox-/)
      await user.click(checkboxes[0])
      
      expect(screen.getByText(/Completed: 1/)).toBeInTheDocument()
      expect(screen.getByText(/Remaining: 1/)).toBeInTheDocument()
    })

    it('باید آمار را بعد از حذف به‌روز کند', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      await user.type(input, 'Todo 1')
      await user.click(addButton)
      
      await user.type(input, 'Todo 2')
      await user.click(addButton)
      
      expect(screen.getByText(/Total: 2/)).toBeInTheDocument()
      
      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])
      
      expect(screen.getByText(/Total: 1/)).toBeInTheDocument()
    })
  })

  // ============================================
  // 6. تست‌های چندگانه
  // ============================================
  describe('6. سناریوهای پیچیده', () => {
    it('باید چندین عملیات را به ترتیب انجام دهد', async () => {
      const user = userEvent.setup()
      render(<TodoList />)
      
      const input = screen.getByTestId('todo-input')
      const addButton = screen.getByTestId('add-todo-button')
      
      // اضافه کردن todos
      await user.type(input, 'First')
      await user.click(addButton)
      
      await user.type(input, 'Second')
      await user.click(addButton)
      
      // complete کردن اولی
      const checkboxes = screen.getAllByTestId(/todo-checkbox-/)
      await user.click(checkboxes[0])
      
      // حذف دومی
      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[1])
      
      // نتیجه: فقط First باقی می‌ماند و complete است
      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.queryByText('Second')).not.toBeInTheDocument()
      expect(screen.getByText(/Total: 1/)).toBeInTheDocument()
      expect(screen.getByText(/Completed: 1/)).toBeInTheDocument()
    })
  })
})

