import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('App', () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [
                { user_id:1, first_name: 'Ana', last_name: 'Paz', full_name: 'Ana Paz' },
            ],
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('carga usuarios y habilita botón al seleccionar usuario', async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        )

        expect(await screen.findByRole('option', { name: 'Ana Paz' })).toBeInTheDocument()

        fireEvent.change(screen.getByLabelText(/usuario/i), {  target: { value: '1'} })

        expect(screen.getByRole('button', { name: /revisar tareas de ana paz/i })).toBeEnabled()
    })
})