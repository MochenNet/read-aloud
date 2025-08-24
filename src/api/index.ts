export const fetchRandomImageUrl = async (): Promise<string | null> => {
  const apiUrl = 'https://api.52vmy.cn/api/img/tu/view';
    const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  try {
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId); // Clear timeout on success

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && typeof data.url === 'string') {
      return data.url;
    }
    return null;
  } catch (error) {
    clearTimeout(timeoutId); // Clear timeout on error
    console.error('Failed to fetch random image URL:', error);
    return null;
  }
};
