import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBase } from '../types/constants';

export const rimApi = createApi({
  reducerPath: 'rimApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${apiBase}` }),
  tagTypes: ['SearchResults'],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (buider) => ({
    getSearch: buider.query({
      query: (search) => `${search}`,
      providesTags: ['SearchResults'],
    }),
  }),
});

export const { useGetSearchQuery } = rimApi;
