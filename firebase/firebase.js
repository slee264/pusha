import admin from 'firebase-admin';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

function firebase_setup(file_path){
    // const firebase_app = initializeApp({
    //     credential: admin.credential.cert(file_path)
    // });
  
    const firebase_app = initializeApp({
        credential: applicationDefault()
    });

    return firebase_app;
}

const registrationToken = 'f89C1frvU7oq4OdEU8CJPG:APA91bEOBO_Ql55hAwTSVE4kpbbXx1aNL7vQzmrIs6HX__-Pal-LYKTl1W-gtXCzBww2CKaUFEd075cMid69Sc6cjKJCNq0v1buTRvhrk27PNRJd6jgGRyOqJAzyySAKnzLOvLW-qt_c';

const message = {
    data: {
        score: '850',
        time: '2:45'
    },
    token: registrationToken
};

function send(message) {
    getMessaging().send(message)
    .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
    })
        .catch((error) => {
        console.log('Error sending message:', error);
    });
}

export { firebase_setup, send }