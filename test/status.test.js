import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import handler from '../api/status.js'

const ENV_KEYS = [
  'DAYTONA_API_KEY',
  'DAYTONA_SNAPSHOT',
  'XAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'X_BEARER_TOKEN',
  'STRIPE_SECRET_KEY',
]

const EXPECTED_KEYS = ['daytona', 'outpostSnapshot', 'grok', 'claude', 'x', 'stripe']

function createRes() {
  const res = {
    statusCode: undefined,
    body: undefined,
    status(code) {
      res.statusCode = code
      return res
    },
    json(payload) {
      res.body = payload
      return res
    },
  }
  return res
}

function callHandler() {
  const res = createRes()
  handler({ method: 'GET' }, res)
  return res
}

describe('api/status', () => {
  let originalEnv

  beforeEach(() => {
    originalEnv = {}
    for (const key of ENV_KEYS) {
      originalEnv[key] = process.env[key]
      delete process.env[key]
    }
  })

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (originalEnv[key] === undefined) delete process.env[key]
      else process.env[key] = originalEnv[key]
    }
  })

  it('responds 200 with exactly the six integration keys', () => {
    const res = callHandler()
    expect(res.statusCode).toBe(200)
    expect(Object.keys(res.body).sort()).toEqual([...EXPECTED_KEYS].sort())
  })

  it('reports every integration as a boolean', () => {
    process.env.DAYTONA_API_KEY = 'sk-daytona-abcdef0123456789'
    process.env.XAI_API_KEY = 'xai-abcdef0123456789'
    const res = callHandler()
    for (const key of EXPECTED_KEYS) {
      expect(typeof res.body[key]).toBe('boolean')
    }
  })

  it('reports false for every integration when nothing is configured', () => {
    const res = callHandler()
    for (const key of EXPECTED_KEYS) {
      expect(res.body[key]).toBe(false)
    }
  })

  it('reports true for each integration whose env var is set', () => {
    process.env.DAYTONA_API_KEY = 'dt-secret'
    process.env.DAYTONA_SNAPSHOT = 'snapshot-name'
    process.env.XAI_API_KEY = 'xai-secret'
    process.env.ANTHROPIC_API_KEY = 'sk-ant-secret'
    process.env.X_BEARER_TOKEN = 'bearer-secret'
    process.env.STRIPE_SECRET_KEY = 'sk_live_secret'
    const res = callHandler()
    for (const key of EXPECTED_KEYS) {
      expect(res.body[key]).toBe(true)
    }
  })

  it('never leaks the configured secret values', () => {
    const secrets = {
      DAYTONA_API_KEY: 'dt-1111111111111111',
      DAYTONA_SNAPSHOT: 'snapshot-2222222222',
      XAI_API_KEY: 'xai-3333333333333333',
      ANTHROPIC_API_KEY: 'sk-ant-4444444444444444',
      X_BEARER_TOKEN: 'bearer-5555555555555555',
      STRIPE_SECRET_KEY: 'sk_live_6666666666666666',
    }
    Object.assign(process.env, secrets)
    const serialized = JSON.stringify(callHandler().body)
    for (const value of Object.values(secrets)) {
      expect(serialized).not.toContain(value)
    }
    expect(serialized).not.toMatch(/sk[-_][A-Za-z0-9]|xai-|bearer|[A-Za-z0-9_-]{20,}/i)
  })
})
