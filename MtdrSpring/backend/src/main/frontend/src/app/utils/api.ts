export async function fetchJsonArray<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    if (!res.ok) {
      console.error(`API error from ${url} (${res.status})`, data);
    } else {
      console.error(`Expected array from ${url}`, data);
    }
    return [];
  } catch (err) {
    console.error(`Failed to fetch ${url}`, err);
    return [];
  }
}
