import admin from 'firebase-admin';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import 'dotenv/config';

async function firebase_setup(){
  console.log("Setting up Firebase...");
  const firebase_app = initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env['GOOGLE_APPLICATION_CREDENTIAL_DEV']))
  });
  console.log("Firebase started.");

  return firebase_app;
}

function send(message) {
  getMessaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      return response;
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  }

export { firebase_setup, send }