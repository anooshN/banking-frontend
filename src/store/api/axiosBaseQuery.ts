import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { RootState } from '../store'

interface RequestArgs {
  url: string
  method?: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
}

export const axiosBaseQuery = ({ baseUrl }: { baseUrl: string }): BaseQueryFn<
  RequestArgs,
  unknown,
  unknown
> =>
  async (args, api) => {
    const state = api.getState() as RootState
    const token = state.auth.accessToken

    try {
      const result = await axios({
        url: baseUrl + args.url,
        method: args.method ?? 'GET',
        data: args.data,
        params: args.params,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
          ...args.headers,
        },
      })

      // Unwrap our ApiResponse wrapper: { success: true, data: ... }
      const responseData = result.data
      if (responseData && typeof responseData === 'object' && 'data' in responseData) {
        return { data: responseData.data }
      }

      return { data: responseData }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }
