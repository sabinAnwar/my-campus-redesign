export async function apiGet(path: string | URL | Request, headers = {}) {
  const res = await fetch(path, {
    headers,
    credentials: "include",
  });
  let data;
  try {
    data = await res.json();
  } catch (_) {
    data = null;
  }
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    const err = new Error(msg) as Error & { status?: number; data?: any };
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function apiJson(path: URL | RequestInfo, method = "POST", body = null, headers = {}) {
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
  };
  if (body) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(path, opts);
  let data;
  let text;
  try {
    data = await res.json();
  } catch (_) {
    try {
      text = await res.text();
    } catch (_) {
      text = null;
    }
    data = null;
  }
  if (!res.ok) {
    const fallback = text && text.length < 500 ? text : null;
    const msg = (data && (data.error || data.message)) || fallback || `HTTP ${res.status}`;
    const err = new Error(msg) as Error & { status?: number; data?: any };
    err.status = res.status;
    err.data = data || { text: fallback };
    throw err;
  }
  return data;
}
