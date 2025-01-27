import {
  type ReadyState,
  type Socket,
  OpenOptions,
  PreconfiguredSocket,
} from '../conn.ts'
import { isNodeEnv } from '../shared.ts'

import { httpPost } from '../shims/node.ts'

export const createPost = httpPost

export interface CreateHTTP {
  (url: Aria2RpcHTTPUrl): Socket
  (url: Aria2RpcHTTPUrl, options: Partial<OpenOptions>): PreconfiguredSocket
}

export type Aria2RpcHTTPUrl =
  | `${'http' | 'https'}://${string}:${number}/jsonrpc`
  | `${'http' | 'https'}://${string}/jsonrpc`

export const createHTTP: CreateHTTP = (
  url: Aria2RpcHTTPUrl,
  options?: Partial<OpenOptions>
) => {
  return new (class extends EventTarget {
    readyState: ReadyState = 1

    close(): void {
      this.readyState = 3
    }

    getOptions() {
      return options
    }

    send(data: string): void {
      createPost(url, data).then((data: string) => {
        this.dispatchEvent(new MessageEvent('message', { data }))
      })
    }
  })() as any
}
