export const isDev =
  process.env['NODE_ENV'] != 'production' ||
  (globalThis as any)?.Deno?.env?.get?.('NODE_ENV') != 'production'

export const isNodeEnv =
  (globalThis as any)?.global?.process?.versions?.node != null

export const once = <T extends unknown[], R>(
  fn: (...args: T) => R
): ((...args: T) => R) => {
  let ret: R
  let triggered = false

  return (...args: T) =>
    triggered ? ret : ((triggered = true), (ret = fn(...args)))
}

export { randomUUID } from 'node:crypto'

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const useTimeout = <T>(
  p: PromiseLike<T>,
  ms: number,
  onTimeout?: () => void
): Promise<T> =>
  Promise.race([
    p,
    sleep(ms).then(() => {
      onTimeout?.()
      throw new Error(`[maria2 error] Timeout of ${ms}ms exceeded`)
    }),
  ])

export { decodeMessageData } from './shims/decode.ts'
