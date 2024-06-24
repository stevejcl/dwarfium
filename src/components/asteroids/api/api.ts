import { RootState } from '@/components/asteroids/api/store'
import { ApiNasaResponse } from '@/components/asteroids/api/types'
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'

const isHydrateAction = (action: Action): action is PayloadAction<RootState> =>
    action.type === HYDRATE

export const API = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL
    }),
    endpoints: (builder) => ({
        getAsteroids: builder.mutation<ApiNasaResponse, string>({
            query: (date) =>
                `?api_key=${process.env.NEXT_PUBLIC_API_KEY}&start_date=${date}&end_date=${date}`
        })
    }),
    extractRehydrationInfo(action, { reducerPath }): any {
        if (isHydrateAction(action)) {
            return action.payload[reducerPath]
        }
    },
    reducerPath: 'api',
    tagTypes: []
})

// Export hooks for usage in functional components
export default API

// export endpoints for use in SSR
// export const { getAsteroids } = api.endpoints
