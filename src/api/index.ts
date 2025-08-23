export const fetchRandomImageUrl = async (): Promise<string | null> => {
  const apiUrl = 'https://api.52vmy.cn/api/img/tu/view';
  console.log(`Fetching image URL from: ${apiUrl}`);
  try {
    const response = await fetch(apiUrl);
    console.log('API Response Status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response Data:', data);
    if (data && typeof data.url === 'string') {
      console.log(`Successfully fetched image URL: ${data.url}`);
      return data.url;
    }
    console.error('API response did not contain a valid URL:', data);
    return null;
  } catch (error) {
    console.error('Failed to fetch random image URL:', error);
    return null;
  }
};
