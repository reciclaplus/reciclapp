import { useQuery } from '@tanstack/react-query'
import { API_URL } from '../configuration'

const usePdr = () => {
    return useQuery({
        queryKey: ['pdr'],
        queryFn: () => fetch(`${API_URL}/pdr/get_all`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then((response) => (response.json())),
        staleTime: 5 * 60 * 1000, // 5 minutes - main data is relatively static
        cacheTime: 10 * 60 * 1000, // 10 minutes
    })
}

const usePublicPdr = () => {
    return useQuery({
        queryKey: ['publicPdr'],
        queryFn: () => fetch(`${API_URL}/public/pdr/get_all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then((response) => (response.json())),
        staleTime: 10 * 60 * 1000, // 10 minutes - public data changes less frequently
        cacheTime: 15 * 60 * 1000, // 15 minutes
    })
}

const useLastN = (n) => {
    return useQuery({
        queryKey: ['lastN', n],
        queryFn: () => fetch(`${API_URL}/recogida/get/last_n?n=${n}`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        }).then((response) => (response.json())),
        staleTime: 2 * 60 * 1000, // 2 minutes - collection data updates more frequently
        cacheTime: 5 * 60 * 1000, // 5 minutes
    })
}

const useRecogidaGetWeek = (year, week) => {
    return useQuery({
        queryKey: ['recogidaGet', { 'year': year, 'week': week }],
        queryFn: () => fetch(`${API_URL}/recogida/get/${year}/${week}`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then((response) => (response.json()))
    })
}

const useWeeklyCollection = (nWeeks, categoria, barrio) => {
    return useQuery({
        queryKey: ['weeklyCollection', { 'n': nWeeks, 'category': categoria, 'barrio': barrio }],
        queryFn: () => fetch(`${API_URL}/recogida/get/last_n_by_barrio?n=${nWeeks}&category=${categoria}&barrio=${barrio}`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then((response) => (response.json())), staleTime: 300000
    })
}

const useWeight = () => {
    return useQuery({
        queryKey: ['weight'],
        queryFn: () => fetch(`${API_URL}/recogida/weight/get`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then((response) => (response.json()))
    })
}

const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => fetch(`${API_URL}/get-current-user`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then((response) => (response.json())),
        staleTime: 15 * 60 * 1000, // 15 minutes - user data rarely changes
        cacheTime: 30 * 60 * 1000, // 30 minutes
        retry: 2, // Retry auth calls a bit more
    })
}

const useRefreshToken = () => {
    return useQuery({
        queryKey: ['refreshToken'],
        queryFn: () => fetch(`${API_URL}/refresh-token`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then(function (response) { return response.json() }
        ).then((data) => {
            console.log('Token refreshed:', data.message)
            // No need to manually update localStorage since tokens are in cookies
            return data
        })
    })
}

const usePublicWeeklyCollection = (nWeeks) => {
    return useQuery({
        queryKey: ['publicWeeklyCollection', nWeeks],
        queryFn: () => fetch(`${API_URL}/public/recogida/get/last_n?n=${nWeeks}`, {
            method: 'GET',
        }).then((response) => response.json())
    })
}

const usePublicWeight = () => {
    return useQuery({
        queryKey: ['publicWeight'],
        queryFn: () => fetch(`${API_URL}/public/recogida/weight/get`, {
            method: 'GET',
        }).then((response) => response.json())
    })
}

export { useCurrentUser, useLastN, usePdr, usePublicPdr, usePublicWeeklyCollection, usePublicWeight, useRecogidaGetWeek, useRefreshToken, useWeeklyCollection, useWeight }

