const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://127.0.0.1:8000';

type PrimitiveValue = string | number | boolean;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  query?: Record<string, PrimitiveValue | null | undefined>;
};

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined) {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  let requestBody: FormData | string | undefined;

  if (options.body instanceof FormData) {
    requestBody = options.body;
  } else if (options.body !== undefined) {
    requestBody = JSON.stringify(options.body);
  }

  const headers: Record<string, string> = {
    ...(options.token
      ? { Authorization: `Bearer ${options.token}` }
      : {}),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers,
      body: requestBody,
    });
  } catch {
    throw new Error(
      `No pudimos conectar con el backend en ${API_BASE_URL}. Verifica que FastAPI siga activo e intenta otra vez.`,
    );
  }

  if (!response.ok) {
    const fallbackMessage = `Error HTTP ${response.status}`;

    try {
      const errorData = (await response.json()) as { detail?: string };
      throw new Error(errorData.detail || fallbackMessage);
    } catch (error) {
      if (error instanceof Error && error.message !== 'Unexpected end of JSON input') {
        throw error;
      }

      throw new Error(fallbackMessage);
    }
  }

  return response.json() as Promise<T>;
}

export { API_BASE_URL };
