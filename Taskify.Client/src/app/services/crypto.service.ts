import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  /**
   * Hash a password using SHA-256 algorithm
   * Matches backend logic:
   * using var sha256 = SHA256.Create();
   * var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
   * return Convert.ToBase64String(bytes);
   */
  async hashPassword(password: string): Promise<string> {
    // Convert string to Uint8Array (UTF-8 bytes) - equivalent to Encoding.UTF8.GetBytes(password)
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Compute SHA-256 hash - equivalent to sha256.ComputeHash()
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert ArrayBuffer to Base64 string - equivalent to Convert.ToBase64String(bytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64Hash = btoa(String.fromCharCode(...hashArray));
    
    return base64Hash;
  }
}
