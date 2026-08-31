import { Request } from 'express';
import * as os from 'os';

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ipString = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ipString.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

export function getClientMac(req: Request): string | null {
  // Check if sent in custom request headers (e.g. from mobile app or proxy)
  const headerMac = req.headers['x-device-mac'] || req.headers['x-mac-address'];
  if (headerMac) {
    return Array.isArray(headerMac) ? headerMac[0] : headerMac;
  }

  // Fallback: Read server network interface MAC address
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (!iface.internal && iface.mac && iface.mac !== '00:00:00:00:00:00') {
        return iface.mac;
      }
    }
  }
  return null;
}
