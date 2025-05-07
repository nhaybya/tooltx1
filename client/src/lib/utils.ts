import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSystemInfo() {
  const now = new Date();
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  
  // Get device info
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const deviceType = isMobile ? 'Mobile' : 'Desktop';
  const browser = getBrowser();
  const deviceStr = `${deviceType} - ${browser}`;
  
  return {
    deviceInfo: deviceStr,
    dateInfo: dateStr
  };
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.indexOf("Chrome") > -1) return "Chrome";
  if (ua.indexOf("Safari") > -1) return "Safari";
  if (ua.indexOf("Firefox") > -1) return "Firefox";
  if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) return "IE";
  if (ua.indexOf("Edge") > -1) return "Edge";
  return "Unknown";
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
