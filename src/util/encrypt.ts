const SECRET_KEY = "anypassword"; 
import CryptoJS from "crypto-js";
export function encryptRole(role: string) {
  return CryptoJS.AES.encrypt(role, SECRET_KEY).toString();
}
export function decryptRole(ciphertext: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}