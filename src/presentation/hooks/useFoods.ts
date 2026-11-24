import { useEffect, useRef, useState } from 'react'
import { FoodRepository } from '../../data/repositories/FoodRepository'
import { Food } from '../../domain/entities/Food'
import { searchOpenFoodFacts } from '../../data/remote/openFoodFacts/OpenFoodFactsClient'
import { searchFood } from '../../domain/usecases/SearchFood'

const repo = new FoodRepository()

export interface FoodsState {
  localFoods: Food[]
  remoteFoods: Food[]
  loadingLocal: boolean
  loadingRemote: boolean
  remoteError: boolean
  query: string
  onSearch: (text: string) => void
}

export function useFoods(): FoodsState {
  const [localFoods, setLocalFoods] = useState<Food[]>([])
  const [remoteFoods, setRemoteFoods] = useState<Food[]>([])
  const [loadingLocal, setLoadingLocal] = useState(true)
  const [loadingRemote, setLoadingRemote] = useState(false)
  const [remoteError, setRemoteError] = useState(false)
  const [query, setQuery] = useState('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoadingLocal(true)

    searchFood(repo, query)
      .then((foods) => {
        if (!cancelled) {
          setLocalFoods(foods)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLocalFoods([])
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingLocal(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [query])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    const trimmed = query.trim()
    if (trimmed.length < 3) {
      setRemoteFoods([])
      setLoadingRemote(false)
      setRemoteError(false)
      return
    }

    let cancelled = false
    const controller = new AbortController()

    setRemoteFoods([])
    setLoadingRemote(true)
    setRemoteError(false)

    debounceRef.current = setTimeout(() => {
      searchOpenFoodFacts(trimmed, controller.signal)
        .then((foods) => {
          if (!cancelled) {
            setRemoteFoods(foods)
            setRemoteError(false)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setRemoteFoods([])
            setRemoteError(true)
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoadingRemote(false)
          }
        })
    }, 600)

    return () => {
      cancelled = true
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      controller.abort()
    }
  }, [query])

  function onSearch(text: string) {
    setQuery(text)
  }

  return {
    localFoods,
    remoteFoods,
    loadingLocal,
    loadingRemote,
    remoteError,
    query,
    onSearch,
  }
}
