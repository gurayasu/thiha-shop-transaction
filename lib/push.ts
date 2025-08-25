import webpush from 'web-push';

const email = process.env.WEB_PUSH_EMAIL || 'example@example.com';
const publicKey = process.env.WEB_PUSH_PUBLIC_KEY || '';
const privateKey = process.env.WEB_PUSH_PRIVATE_KEY || '';

if (publicKey && privateKey) {
  webpush.setVapidDetails(`mailto:${email}`, publicKey, privateKey);
}

export async function sendPush(subscription: any, payload: any) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (e) {
    console.error('push error', e);
  }
}
