'use client'

import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      }
      setTodos([...todos, newTodo])
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <div className="todo-list" data-testid="todo-list">
      <h2>Todo List</h2>
      
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a todo..."
          data-testid="todo-input"
        />
        <button onClick={addTodo} data-testid="add-todo-button">
          Add
        </button>
      </div>

      <div className="todo-stats" data-testid="todo-stats">
        <p>
          Total: {todos.length} | Completed: {completedCount} | Remaining:{' '}
          {todos.length - completedCount}
        </p>
      </div>

      <ul className="todo-items" data-testid="todo-items">
        {todos.length === 0 ? (
          <li data-testid="empty-message">No todos yet. Add one above!</li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              data-testid={`todo-item-${todo.id}`}
              className={todo.completed ? 'completed' : ''}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                data-testid={`todo-checkbox-${todo.id}`}
              />
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                data-testid={`delete-todo-${todo.id}`}
                aria-label={`Delete ${todo.text}`}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

