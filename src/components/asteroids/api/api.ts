import { RootState } from "@/components/asteroids/api/store";
import { ApiNasaResponse } from "@/components/asteroids/api/types";
import type { Action, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

const isHydrateAction = (action: Action): action is PayloadAction<RootState> =>
  action.type === HYDRATE;

// Fetch API key from local storage and trim surrounding quotes
const getApiKey = () => {
  const apiKey = localStorage.getItem("NasaApiKey") || "";
  return apiKey.replace(/^"(.*)"$/, "$1"); // Trim surrounding quotes
};

export const API = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.nasa.gov/neo/rest/v1/feed",
  }),
  endpoints: (builder) => ({
    getAsteroids: builder.mutation<ApiNasaResponse, string>({
      query: (date) => {
        const apiKey = getApiKey();
        return `?api_key=${apiKey}&start_date=${date}&end_date=${date}`;
      },
    }),
  }),
  // Extract rehydration info for hydration
  // This assumes you are using next-redux-wrapper
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      return action.payload[reducerPath];
    }
  },
  reducerPath: "api", // Reducer path for the API slice
  tagTypes: [], // Optional tag types for endpoints
});

// Export hooks for usage in functional components
export const { useGetAsteroidsMutation } = API;

// Export endpoints for use in SSR or other components if needed
export const { getAsteroids } = API.endpoints;
