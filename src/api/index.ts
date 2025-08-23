export const fetchRandomImageUrl = async (): Promise<string | null> => {
  const apiUrl = 'https://api.52vmy.cn/api/img/tu/view';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && typeof data.url === 'string') {
      return data.url;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch random image URL:', error);
    return null;
  }
};
