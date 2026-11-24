const queues = new Map<string, Promise<void>>()

export async function runExclusive<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve()

  let release: () => void = () => {}
  const current = new Promise<void>((resolve) => {
    release = resolve
  })

  queues.set(key, current)

  try {
    await previous
    return await fn()
  } finally {
    release()
    if (queues.get(key) === current) {
      queues.delete(key)
    }
  }
}
