// window.addEventListener('message', function(event) {
//   let data = event.data;

//   console.log('Message received:', event);
//   console.log('data:', data);
//   if (data.message === 'tipsCashSetup') {
//     console.log('Setting up tips.cash events using data:', data);
//     doTipsCashSetup(data);
//   }

// }, false);


// var tipscashSetupComplete = false;

// function doTipsCashSetup(setupData) {
//   if (tipscashSetupComplete) {
//     console.log('tip.cash events have already been set up!');
//     return;
//   }

//   let myCashAddress = setupData.cashAddress;
//   console.log('Setting up tips.cash.js socket events using address:', myCashAddress);

//   // When a user creates a new tips.cash account by signing in
//   // with one of the tips.cash-enabled social media platforms.
//   // This includes Telescope users and is the primary way Telescope
//   // will know when a user has successfully linked their youtube/reddit
//   // account to Tips.cash/Telescope
//   io.socket.on('account', function(account) {
//     console.log('account!', account);
//     if (account.cashAddress === myCashAddress) {
//       console.log('Hey, thats me.  I can update the Telescope UI or whatever I need to do');

//       showNotification({
//         title: 'Account linked!',
//         body: 'All '+account.platformName+' tips will go to '+account.cashAddress
//       });

//     }

//   });

//   // When a new BCH block is solved 
//   io.socket.on('block', function(blockHash) {

//     showNotification({
//       title: 'A new block was found!',
//       body: 'Long live the new tip, '+blockHash+'!'
//     });

//     console.log('block', blockHash, 'has been solved!');
//   });

//   // When any user is tipped on any tips.cash-enabled social media platform
//   io.socket.on('tip', function(someData) {

//     showNotification({
//       title: someData.platformName+' user '+someData.platformUserId+' has been tipped!',
//       body: '$'+someData.amounts.amountUSD+' for '+someData.contentId
//     });

//     console.log('tip!', someData);
//   });

//   io.socket.on(myCashAddress, function(someData) {
//     // showNotification({
//     //   title: 'Something specific happened',
//     //   body: 'An event targeting your address has been received!'
//     // });
//     console.log('I have received an event directly pertaining specifically to my address which is', myCashAddress,':', someData);
//   });

//   io.socket.on('price', function(someData) {
//     // showNotification({
//     //   title: 'New price data!',
//     //   body: '1 bch === '+someData.average+' usd'
//     // });
//     console.log('price!', someData);
//   });

//   // Subscribe to the events and watch the data flow
//   // io.socket.get('http://localhost:1337/listen/events/block,tip,price,account');
//   // io.socket.get('http://localhost:1337/listen/user/bitcoincash:qrnjg3lfevd2jfgj9r7s0kvyaywv7az8mcvsd2f9c5');
//   io.socket.get('https://tipscash.herokuapp.com/listen/events/block,tip,price,account');
//   io.socket.get('https://tipscash.herokuapp.com/listen/user/'+myCashAddress);

//   tipscashSetupComplete = true;

// };

// // Listen for the message signaling that the
// // social media setup has been completed and
// // we should connect to the tips.cash server.

// var showNotification = function(messageObject) {
//   console.log('showing new notification:', messageObject);
//   new Notification(messageObject.title, {
//     icon: 'alert128.png',
//     body: messageObject.body
//   });
// };


// $(document).ready(function () {

// });


