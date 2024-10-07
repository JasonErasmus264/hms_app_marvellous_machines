import webPush from 'web-push';

// VAPID keys setup (replace with your actual keys)
const vapidKeys = {
    publicKey: 'your-public-key',
    privateKey: 'your-private-key'
};

webPush.setVapidDetails(
    'mailto:your-email@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

exports.subscribe = (req, res) => {
    const subscription = req.body;
    
    res.status(201).json({}); // Acknowledge subscription
    
    const payload = JSON.stringify({ title: 'Push Test', body: 'This is a test push notification!' });

    webPush.sendNotification(subscription, payload)
        .catch(error => console.error('Error sending notification:', error));
};
