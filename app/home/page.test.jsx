import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from './page'
 
describe('Home Page', () => {
  it('renders heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders welcome text', () => {
    render(<Home />)
    const text = screen.getByText('Welcome to the home page')
    expect(text).toBeInTheDocument()
  })
})