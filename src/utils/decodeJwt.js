// دالة  لفك التوكن وقراءة البيانات منه
export function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1]; // استخراج الـ Payload (الجزء الثاني)
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}
