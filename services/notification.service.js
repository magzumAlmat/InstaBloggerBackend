const https = require('https');
const { User } = require('../models');

exports.sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    const user = await User.findByPk(userId);
    if (!user || !user.push_token) return;

    const message = {
      to: user.push_token,
      sound: 'default',
      title,
      body,
      data,
    };

    const postData = JSON.stringify(message);

    const options = {
      hostname: 'exp.host',
      port: 443,
      path: '/--/api/v2/push/send',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      // res.on('data', (d) => process.stdout.write(d));
    });

    req.on('error', (e) => {
      console.error('Push notification error:', e);
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('Notification service error:', error);
  }
};
