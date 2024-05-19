/**
 * Function to encrypt a key
 * @param key
 * @returns {Promise<{encrypted: ArrayBuffer, iv: Uint8Array, exportedCryptoKey: number[]}>}
 */
export async function encryptKey(key) {
  const encoded = new TextEncoder().encode(key);
  const cryptoKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoded
  );
  const exportedCryptoKey = await crypto.subtle.exportKey("raw", cryptoKey);
  return { encrypted, iv, exportedCryptoKey: Array.from(new Uint8Array(exportedCryptoKey)) };
}

// Fonction pour stocker la clé chiffrée
export async function storeKey(key) {
  const { encrypted, iv, exportedCryptoKey } = await encryptKey(key);
  chrome.storage.local.set({ encryptedKey: Array.from(new Uint8Array(encrypted)), iv: Array.from(new Uint8Array(iv)), cryptoKey: exportedCryptoKey }, function() {
    console.log('Key is encrypted and stored.');
  });
}

// Fonction pour déchiffrer la clé
export async function decryptKey(encrypted, iv, exportedCryptoKey) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(exportedCryptoKey),
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    cryptoKey,
    new Uint8Array(encrypted)
  );
  return new TextDecoder().decode(decrypted);
}

// Récupérer et déchiffrer la clé
chrome.storage.local.get(['encryptedKey', 'iv', 'cryptoKey'], async function(result) {
  const decryptedKey = await decryptKey(result.encryptedKey, result.iv, result.cryptoKey);
  console.log('Encrypted Key:', result.encryptedKey);
  console.log('Decrypted Key:', decryptedKey);
});
