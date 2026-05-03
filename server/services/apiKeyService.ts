import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const tempDir = process.env.VERCEL === '1' ? '/tmp' : process.cwd();
const API_KEYS_FILE = path.resolve(tempDir, 'api_keys.json');

// Ensure the file exists gracefully
try {
  if (!fs.existsSync(API_KEYS_FILE)) {
    fs.writeFileSync(API_KEYS_FILE, JSON.stringify([]));
  }
} catch (e) {
  console.warn("Could not write api_keys.json on startup. Running in read-only environment without /tmp access.");
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

// In-memory fallback if file writing fails repeatedly
let memoryKeys: ApiKey[] = [];

export const apiKeyService = {
  getKeys(): ApiKey[] {
    try {
      if (fs.existsSync(API_KEYS_FILE)) {
        const data = fs.readFileSync(API_KEYS_FILE, 'utf-8');
        return JSON.parse(data) as ApiKey[];
      }
    } catch {
      // Ignored
    }
    return memoryKeys.length > 0 ? memoryKeys : [];
  },

  saveKeys(keys: ApiKey[]) {
    memoryKeys = keys;
    try {
      fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keys, null, 2));
    } catch (e) {
      console.warn("Could not save api keys to file, keeping in memory.");
    }
  },

  generateKey(name: string): ApiKey {
    const keys = this.getKeys();
    
    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const newKeyStr = `aether_${token}`;
    
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name,
      key: newKeyStr,
      createdAt: new Date().toISOString(),
      lastUsed: null
    };

    keys.push(newKey);
    this.saveKeys(keys);
    return newKey;
  },

  revokeKey(id: string) {
    const keys = this.getKeys();
    const newKeys = keys.filter(k => k.id !== id);
    this.saveKeys(newKeys);
  },

  validateKey(keyString: string): boolean {
    const keys = this.getKeys();
    const key = keys.find(k => k.key === keyString);
    if (key) {
      // Update lastUsed
      key.lastUsed = new Date().toISOString();
      this.saveKeys(keys);
      return true;
    }
    return false;
  }
};
