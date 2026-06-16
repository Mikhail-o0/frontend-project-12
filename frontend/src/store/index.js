import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'
import { channelsApi } from '../api/channelsApi'
import { messagesApi } from '../api/messagesApi'
import authReducer from '../slices/authSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(channelsApi.middleware)
      .concat(messagesApi.middleware),
})