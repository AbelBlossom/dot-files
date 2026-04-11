import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Poem App UI', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('loads and displays poems, and allows creating a poem', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ poems: [] }) })
    render(<App />)
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/poems'))

    const createNav = screen.getByText('Create Poem')
    await userEvent.click(createNav)

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ poem: { id: 'p1', title: 't', body: 'b' } }) })
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ poems: [{ id: 'p1', title: 't', body: 'b' }] }) })

    const title = screen.getByLabelText(/title/i)
    const body = screen.getByLabelText(/poem/i)
    const submit = screen.getByRole('button', { name: /save poem/i })

    await userEvent.type(title, 't')
    await userEvent.type(body, 'b')
    await userEvent.click(submit)

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
    expect(screen.getByText('t')).toBeInTheDocument()
  })
})
