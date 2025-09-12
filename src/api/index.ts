export const fetchRandomImageUrl = async (): Promise<string | null> => {
  const apiUrl = 'https://api.dwo.cc/api/fj_pe';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  try {
    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageBlob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
    return null;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('获取随机图片URL失败:', error);
    return null;
  }
};

// 新增通用请求函数
export const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T | null> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, { signal: controller.signal, ...options });
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error(`HTTP 请求错误! 状态码: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('API 请求失败:', error);
        return null;
    }
};

// 示例新增接口：获取文章数据
export const fetchArticleData = async (id: string): Promise<any | null> => {
    const url = `https://example.com/api/articles/${id}`; // 替换为实际URL
    return apiRequest(url);
};

// 新增获取随机音乐的接口
export const fetchRandomMusic = async (): Promise<{ title: string; url: string } | null> => {
    const apiUrl = 'https://api.cenguigui.cn/api/music/ximalaya_gangqin.php';
    try {
        const data = await apiRequest<{ code: number; title: string; url: string }>(apiUrl);
        if (data && data.code === 200 && data.title && data.url) {
            return { title: data.title, url: data.url.replace('http://', 'https://') };
        }
        console.error('无效的响应格式或状态码不是200:', data);
        return null;
    } catch (error) {
        console.error('获取随机音乐失败:', error);
        return null;
    }
};
