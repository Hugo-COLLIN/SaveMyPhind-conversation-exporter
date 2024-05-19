// import Analytics from 'analytics';
// import googleAnalytics from '@analytics/google-analytics';
import {ga4} from "../../../config";

export function sendAnalytics() {
  fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${ga4.measurement_id}&api_secret=${ga4.api_secret}`, { //https://www.google-analytics.com/debug/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}
    method: "POST",
    body: JSON.stringify({
      client_id: 'XXXXXXXXXX.YYYYYYYYYY',
      events: [{
        name: 'Download',
        params: {
          "and": "whatever you wish..."
        }
      }]
    })
  })
    .then(res => console.log(res))
    // .then(res => res.json())
    // .then(res => console.log(res))
    .catch(err => console.error(err));


  // async function sendEventToGA4() {
  //   const ANALYTICS_PATH = "https://www.google-analytics.com/debug/mp/collect";
  //   const measurementId = 'G-HKP3RC7RH7'; // Remplacez par votre propre Measurement ID
  //   const apiSecret = 'IDZKduZjTo-rNl-H3LlcaA'; // Remplacez par votre propre API Secret
  //
  //   const eventData = {
  //     client_id: '555',  // Client ID, should be unique per user
  //     events: [{
  //       name: 'click',
  //       params: {
  //         event_category: 'Extension',
  //         event_label: 'testEvent',
  //         value: 100
  //       }
  //     }]
  //   };
  //
  //   const response = await fetch(ANALYTICS_PATH, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       ...eventData,
  //       measurement_id: 'G-HKP3RC7RH7',
  //       api_secret: apiSecret
  //     })
  //   });
  //
  //   const res = await response.json();
  //   if (response.ok) {
  //     console.log('Event sent successfully:', res);
  //   } else {
  //     console.error('Failed to send event:', response.status, await response.text());
  //   }
  //
  //   return res;  // Pour obtenir la réponse du serveur et vérifier le statut de l'envoi
  // }
  //
  // sendEventToGA4().then(res => console.log("GA sent, response received: ", res));  // Appel de la fonction pour envoyer l'événement
  //

//   const analytics = Analytics({
//     app: 'save-my-chatbot',
//     plugins: [
//       googleAnalytics({
//         measurementIds: ['G-HKP3RC7RH7']
//       })
//     ]
//   });
//
// // Example of tracking an event
//   analytics.track('eventName', {
//     eventCategory: 'category',
//     eventAction: 'action',
//     eventLabel: 'label',
//     eventValue: 'value',
//     debug_mode: true,
//   });
//
//   const ANALYTICS_PATH = "https://www.google-analytics.com/collect"; //"https://www.google-analytics.com/debug/collect";
//
//   async function postData(url = '', data = {}) {
//     const response = await fetch(url, {
//       method: 'POST',
//       mode: 'no-cors',
//       cache: 'no-cache',
//       credentials: 'same-origin',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       redirect: 'follow',
//       referrerPolicy: 'no-referrer',
//       body: data
//     });
//     return response;  // You can log this response or use it to check the status
//   }
//
//   var gaParams = new URLSearchParams();
//   gaParams.append("v", 1);
//   gaParams.append("tid", "UA-XXXXX-Y");  // Replace with your Tracking ID
//   gaParams.append("cid", "555");  // Client ID, should be unique per user
//   gaParams.append("t", "event");
//   gaParams.append("ec", "Extension");
//   gaParams.append("ea", "click");
//   gaParams.append("el", "testEvent");
//   gaParams.append("ev", "100");
//
//   postData(ANALYTICS_PATH, gaParams.toString());

}
