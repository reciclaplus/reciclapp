import { useQuery } from '@tanstack/react-query'
import { API_URL } from '../configuration'

const usePdr = () => {
    return useQuery({
        queryKey: ['pdr'],
        queryFn: () => fetch(`${API_URL}/pdr/get_all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).then((response) => (response.json()))
    })
}

const useLastN = (n) => {
    return useQuery({
        queryKey: ['lastN', n],
        queryFn: () => fetch(`${API_URL}/recogida/get/last_n?n=${n}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
        }).then((response) => (response.json()))
    })
}

const useRecogidaGetWeek = (year, week) => {
    return useQuery({
        queryKey: ['recogida_get', { 'year': year, 'week': week }],
        queryFn: () => fetch(`${API_URL}/recogida/get/${year}/${week}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).then((response) => (response.json()))
    })
}

const useWeeklyCollection = (nWeeks, categoria, barrio) => {
    return useQuery({
        queryKey: ['weeklyCollection', { 'n': nWeeks, 'category': categoria, 'barrio': barrio }],
        queryFn: () => fetch(`${API_URL}/recogida/get/last_n_by_barrio?n=${nWeeks}&category=${categoria}&barrio=${barrio}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).then((response) => (response.json())), staleTime: 300000
    })
}

const useWeight = () => {
    return useQuery({
        queryKey: ['weight'],
        queryFn: () => fetch(`${API_URL}/recogida/weight/get`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).then((response) => (response.json()))
    })
}

const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => fetch(`${API_URL}/get-current-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        }).then((response) => (response.json()))
    })
}

const useRefreshToken = () => {
    return useQuery({
        queryKey: ['refreshToken'],
        queryFn: () => fetch(`${API_URL}/refresh-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.refresh_token
            }
        }).then(function (response) { return response.json() }
        ).then((data) => {

            localStorage.setItem("token", data["token"])
            localStorage.setItem("id_token", data["id_token"])
            localStorage.setItem("refresh_token", data["refresh_token"])
            localStorage.setItem("expiry", data["expiry"])
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
        queryKey: ['publicWeeklyCollection'],
        queryFn: () => fetch(`${API_URL}/public/recogida/weight/get`, {
            method: 'GET',
        }).then((response) => response.json())
    })
}

export { useCurrentUser, useLastN, usePdr, usePublicWeeklyCollection, usePublicWeight, useRecogidaGetWeek, useRefreshToken, useWeeklyCollection, useWeight }

