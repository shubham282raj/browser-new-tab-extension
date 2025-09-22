function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("myCacheDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("images");
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function cacheImage(url, key = "background") {
  const db = await openDB();

  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");
    const request = store.put(blob, key);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function getCachedImage(key) {
  key = Number(key);
  if (key == NaN) return;

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");
    const request = store.get(key);

    request.onsuccess = (event) => {
      const blob = event.target.result;
      if (!blob) return resolve(null);

      // Convert blob to a URL to use in CSS or <img>
      const url = URL.createObjectURL(blob);
      resolve(url);
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

export async function cacheUploadedImage(file, key) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    // store File/Blob directly
    const request = store.put(file, key);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function listCachedImageKeys() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readonly");
    const store = transaction.objectStore("images");

    const request = store.getAllKeys();

    request.onsuccess = (event) => {
      resolve(event.target.result); // array of all keys
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

export async function deleteCachedImage(imgkey) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    const request = store.delete(imgkey);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}
