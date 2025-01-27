import { Buffer } from 'node:buffer'
import { request } from 'node:http'

export const httpPost = (url: string, json: string) => {
  return new Promise<string>((onResolve, onReject) => {
    const req = request(
      url,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(json),
        },
      },
      async (res) => {
        // dynamic import decoder
        const { decodeMessageData } = await import('./decode.ts')

        res.setEncoding('utf8')

        const chunks: any[] = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => onResolve(decodeMessageData(chunks)))
      }
    )

    req.once('error', onReject)

    req.write(json)
    req.end()
  })
}
