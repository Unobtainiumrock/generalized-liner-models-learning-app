import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from '@/components/controls/Slider'

describe('Slider Component', () => {
  it('should render with correct label and value', () => {
    const mockOnChange = vi.fn()
    render(
      <Slider
        label="Test Slider"
        value={5}
        min={0}
        max={10}
        step={1}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('Test Slider')).toBeInTheDocument()
    expect(screen.getByText('5.00')).toBeInTheDocument()
  })

  it('should call onChange when slider value changes', () => {
    const mockOnChange = vi.fn()
    render(
      <Slider
        label="Test Slider"
        value={5}
        min={0}
        max={10}
        step={1}
        onChange={mockOnChange}
      />
    )

    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '7' } })

    expect(mockOnChange).toHaveBeenCalledWith(7)
  })

  it('should display value with correct decimal places', () => {
    const mockOnChange = vi.fn()
    render(
      <Slider
        label="Test Slider"
        value={3.14159}
        min={0}
        max={10}
        step={0.1}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('3.14')).toBeInTheDocument()
  })
})
