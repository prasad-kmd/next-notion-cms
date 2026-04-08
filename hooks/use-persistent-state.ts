"use client"

import { useState, useEffect } from "react"

export function usePersistentState<T>(key: string, defaultValue: T) {
    const [state, setState] = useState<T>(defaultValue)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const savedValue = localStorage.getItem(key)
        if (savedValue !== null) {
            try {
                setState(JSON.parse(savedValue))
            } catch (e) {
                console.error(`Error parsing persistent state for key "${key}":`, e)
            }
        }
        setIsLoaded(true)
    }, [key])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(key, JSON.stringify(state))
        }
    }, [key, state, isLoaded])

    return [state, setState, isLoaded] as const
}
