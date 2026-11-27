/** Giờ hiện tại dạng HH:mm:ss (giờ Việt Nam). */
export const nowTime = (): string =>
  new Date().toLocaleTimeString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
