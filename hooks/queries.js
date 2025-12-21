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
        }).then((response) => (response.json()))
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
        }).then((response) => (response.json()))
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
        }).then((response) => (response.json()))
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
        }).then((response) => (response.json()))
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


const usePublicWeightByType = () => {
    return useQuery({
        queryKey: ['publicWeightByType'],
        queryFn: () => fetch(`${API_URL}/public/recogida/weight/total_by_type`, {
            method: 'GET',
        }).then((response) => response.json())
    })
}

const usePublicSuccessfulRecogidas = () => {
    return useQuery({
        queryKey: ['publicSuccessfulRecogidas'],
        queryFn: () => fetch(`${API_URL}/public/recogida/successful_count`, {
            method: 'GET',
        }).then((response) => response.json())
    })
}

const useTowns = () => {
    return useQuery({
        queryKey: ['towns'],
        queryFn: () => fetch(`${API_URL}/towns`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then((response) => response.json()),
        staleTime: 300000 // Cache for 5 minutes
    })
}

const useTown = (townId) => {
    return useQuery({
        queryKey: ['town', townId],
        queryFn: () => fetch(`${API_URL}/towns/${townId}`, {
            method: 'GET',
            credentials: 'include', // Include cookies
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then((response) => response.json()),
        enabled: !!townId, // Only run query if townId is provided
        staleTime: 300000 // Cache for 5 minutes
    })
}

export { useCurrentUser, useLastN, usePdr, usePublicPdr, usePublicSuccessfulRecogidas, usePublicWeightByType, useRecogidaGetWeek, useRefreshToken, useTown, useTowns, useWeeklyCollection, useWeight }

