import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../store/store'
import LoginPage from '../pages/auth/LoginPage'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  )

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the login form', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation error for empty email', async () => {
    renderWithProviders(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('calls login API with correct data', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          accessToken: 'token123',
          refreshToken: 'refresh123',
          userId: 'user-1',
          email: 'test@banking.com',
          roles: ['ROLE_CUSTOMER'],
          mfaRequired: false
        }
      }
    })

    renderWithProviders(<LoginPage />)
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@banking.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'SecurePass@123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/v1/auth/login',
        expect.objectContaining({ email: 'test@banking.com' })
      )
    })
  })

  it('displays error on failed login', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    })

    renderWithProviders(<LoginPage />)
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'bad@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpass' }
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})
