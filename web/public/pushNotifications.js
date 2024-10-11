// Register Service Worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
          .then(function (registration) {
              console.log('Service Worker Registered for Push Notifications');
          })
          .catch(function (err) {
              console.error('Service Worker registration failed: ', err);
          });
  }
};

// Ask user permission for notifications
export const askUserPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
      console.log('Notification permission granted.');
  }
};

// Subscribe user to push service
export const subscribeUser = async (publicKey) => {
  const sw = await navigator.serviceWorker.ready;
  const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
  });
  await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' }
  });
};

// Utility function for base64 encoding
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};
