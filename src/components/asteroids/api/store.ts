import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import { API } from './api'

export const store = () =>
    configureStore({
        middleware: (gDM) => gDM().concat(API.middleware),
        reducer: {
            [API.reducerPath]: API.reducer
        }
    })

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
// export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper<AppStore>(store, { debug: false })
