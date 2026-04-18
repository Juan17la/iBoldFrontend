import type {
  ApiClientError,
  ApiError,
  GenerateRequest,
  GenerateResponse,
  LoginRequest,
  LoginResponse,
  QuotaHistoryResponse,
  QuotaStatusResponse,
  RegisterRequest,
  RegisterResponse,
  UpgradeRequest,
  UpgradeResponse,
} from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('Falta VITE_API_BASE_URL. Configuralo en el archivo .env.')
}

const buildError = (
  message: string,
  status = 500,
  data?: ApiError,
  retryAfterSeconds?: number,
): ApiClientError => {
  const error = new Error(message) as ApiClientError
  error.status = status
  error.data = data
  error.retryAfterSeconds = retryAfterSeconds
  return error
}

const request = async <T>(
  path: string,
  options: RequestInit,
): Promise<{ data: T; retryAfterSeconds?: number }> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  const retryAfterHeader = response.headers.get('Retry-After')
  const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : undefined

  if (!response.ok) {
    let errorData: ApiError | undefined

    try {
      errorData = (await response.json()) as ApiError
    } catch {
      throw buildError('Error inesperado del servidor', response.status, undefined, retryAfterSeconds)
    }

    throw buildError(
      errorData.message || 'La solicitud fallo',
      response.status,
      errorData,
      retryAfterSeconds,
    )
  }

  const json = (await response.json()) as T
  return { data: json, retryAfterSeconds }
}

export const api = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const { data } = await request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data
  },

  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data
  },

  generate: async (
    payload: GenerateRequest,
  ): Promise<{ data: GenerateResponse; retryAfterSeconds?: number }> =>
    request<GenerateResponse>('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getQuotaStatus: async (
    email: string,
    password: string,
  ): Promise<QuotaStatusResponse> => {
    const { data } = await request<QuotaStatusResponse>('/api/quota/status', {
      method: 'GET',
      headers: {
        'X-User-Email': email,
        'X-Password': password,
      },
    })
    return data
  },

  getQuotaHistory: async (
    email: string,
    password: string,
  ): Promise<QuotaHistoryResponse> => {
    const { data } = await request<QuotaHistoryResponse>('/api/quota/history', {
      method: 'GET',
      headers: {
        'X-User-Email': email,
        'X-Password': password,
      },
    })
    return data
  },

  upgradePlan: async (payload: UpgradeRequest): Promise<UpgradeResponse> => {
    const { data } = await request<UpgradeResponse>('/api/quota/upgrade', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data
  },
}
