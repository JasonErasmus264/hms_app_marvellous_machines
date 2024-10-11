self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received:', data);

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: './icon.png',
    });
});
