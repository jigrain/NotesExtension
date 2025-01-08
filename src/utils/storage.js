export const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Chrome')) {
    return 'Chrome';
  }
  return 'Unknown';
};

const isFirefox = getBrowserName() === 'Firefox';

// Універсальна функція для збереження даних
export const saveDataToStorage = (key, data) => {
  console.log("Browser type: "+ getBrowserName())
  return new Promise((resolve, reject) => {
    if (isFirefox) {
      // Для Firefox
      browser.storage.local.set({ [key]: data }).then(
        () => resolve(),
        (error) => reject(error)
      );
    } else {
      // Для Chrome
      chrome.storage.local.set({ [key]: data }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    }
  });
};

// Універсальна функція для завантаження даних
export const loadDataFromStorage = (key) => {
  console.log("Browser type: "+ getBrowserName())
  return new Promise((resolve, reject) => {
    if (isFirefox) {
      // Для Firefox
      browser.storage.local.get(key).then(
        (result) => resolve(result[key] || []),
        (error) => reject(error)
      );
    } else {
      // Для Chrome
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key] || []);
        }
      });
    }
  });
};
