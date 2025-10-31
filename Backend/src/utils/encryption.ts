// 📁 Backend/src/utils/encryption.ts
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🔐 Load the encryption key from environment variables.
 * It must be exactly 32 bytes (for AES-256-CBC).
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.warn(
    "⚠️  ENCRYPTION_KEY is missing or not 32 bytes long. " +
    "Using fallback key for development only. Please fix this in production!"
  );
}

const KEY = Buffer.from(ENCRYPTION_KEY || "your_32_byte_random_key_here");
const IV_LENGTH = 16;

/**
 * 🔒 Encrypt a text value using AES-256-CBC
 * @param text - Plaintext to encrypt
 * @returns Encrypted string in format iv:encryptedData
 */
export const encrypt = (text: string): string => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (err) {
    console.error("💥 Encryption failed:", (err as Error).message);
    throw new Error("Encryption error");
  }
};

/**
 * 🔓 Decrypt a text value using AES-256-CBC
 * @param encryptedText - The string in format iv:encryptedData
 * @returns Decrypted plaintext
 */
export const decrypt = (encryptedText: string): string => {
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !encrypted) throw new Error("Invalid encrypted format");

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("💥 Decryption failed:", (err as Error).message);
    throw new Error("Decryption error");
  }
};

/**
 * 🧠 Utility: Verify key strength and readiness
 */
export const verifyEncryptionReady = (): boolean => {
  if (!ENCRYPTION_KEY) {
    console.error("❌ Missing ENCRYPTION_KEY in .env file.");
    return false;
  }
  if (ENCRYPTION_KEY.length !== 32) {
    console.error("❌ ENCRYPTION_KEY must be exactly 32 bytes long.");
    return false;
  }
  console.log("✅ Encryption module ready and secure.");
  return true;
};
