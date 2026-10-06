import type { JwtUserPayload } from "@/types/globalTypes"

// 2. الدالة أصبحت محمية ومخرجاتها واضحة ومقروءة للمشروع بالكامل
export function decodeJwt(token: string | undefined): JwtUserPayload | null {
  try {
    if (!token) throw new Error('Token is undefined or empty');

    const parts = token.split('.');
    const base64Url: string | undefined = parts[1];
    if (!base64Url) throw new Error('base64Url is undefined or empty');

    const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    // نؤكد للمترجم أن القيمة الراجعة تطابق الـ Interface بالملي
    return JSON.parse(jsonPayload) as JwtUserPayload;
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
}
