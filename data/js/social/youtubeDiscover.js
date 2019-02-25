/*

    Content script checking/watching Youtube related pages for places
    we can manipulate the DOM in order to add tipping functionality.

*/
var updating = false;

var observer = new MutationObserver(function(mutations) {
  if (updating) {
    return;
  }
  else {
    updating = true;
    processPage();
  }
});


var openTipsCashPopup = async function(someHtmlElement, rect) {

  // let platformIdentType;
  // let splitUserId = this.platformUserId.split(':');
  // if ( splitUserId.length < 2) {
  //   platformIdentType = 'id';
  // }
  // else {
  //   platformIdentType = splitUserId[0] ? 
  // }

console.log('opening tipscashpopup!');


  let nodeData = $(someHtmlElement).data();

  // URI encode this field before we send it off for encryption
  // so it doesn't get mangled by the webserver's body parser.
  let encodedOpreturn = encodeURIComponent('tipscash::'+nodeData.platformname+'::'+nodeData.contentid);

  // Encrypt the opreturn string while this project is still 
  // in stealth mode. Once we release, this will be public.
  let opreturnString;
  try {
    opreturnString = await util.getJSON('https://tipscash.herokuapp.com/encrypt?opreturn='+encodedOpreturn);
  }
  catch(nope) {
    console.log('Cannot fetch opreturn string from tipscash:', nope);
    return false;
  }

  let fetchAccountUri = 'https://tipscash.herokuapp.com/search/'+nodeData.platformname+'/' + ( nodeData.useridenttype ? ( nodeData.useridenttype +'/'+nodeData.platformuserid ) : ( 'ident/' + nodeData.platformuserid) );

  let tipscashAccount;
  try {
    tipscashAccount = await util.getJSON(fetchAccountUri);
    tipscashAccount = tipscashAccount[0];
  }
  catch(nope) {
    console.log('Cannot fetch tipscash account for ', fetchAccountUri, ':', nope);
    return false
  }

  // console.log('tipscashAccount:', tipscashAccount);
  // console.log('window.showPopup:', window.showPopup);
  window.showPopup(tipscashAccount['cashAddress'], null, rect, undefined, undefined, opreturnString);

};

var setClickListener = function(someNode) {

  // DONT FUCK WITH PUSH NOTIFICATIONS.
  // JUST FETCH THE FUCKING DATA AFTER 
  // WE SUBMIT THE TRANSACTION.

  $(someNode).on('click', function (event) {
    var nodeData = $(this).data();
    var rect =  this.getBoundingClientRect();

    openTipsCashPopup(someNode, rect);
    event.stopPropagation();
    event.preventDefault();
    return false;
  });
}

observer.observe(document, {childList: true, subtree: true});

var videoOwnerNode;
var channelContainerNode;

var videoOwnerUsername;
var videoOwnerUsername2;
var videoOwnerChannelName;
var videoId;

var processPage = async function(isFirstLoad) {
  // Add Icon on the video level

  if (!videoOwnerNode && !channelContainerNode) {

    var ownerNode = $('a.ytd-video-owner-renderer');
    videoOwnerNode = ownerNode.length ? ownerNode[0] : undefined;

    var channelContainer = $('#owner-container').find('yt-formatted-string#owner-name').find('a.yt-formatted-string');
    channelContainerNode = channelContainer.length ? channelContainer[0] : undefined;

    if (videoOwnerNode && channelContainerNode) {
      console.log('videoOwnerNode:', videoOwnerNode);
      console.log('channelContainerNode:', channelContainerNode);

      videoId = window.location.href.match(/v=[^&]+/ig)[0];
      videoId = videoId.replace(/v=/,'');

      videoOwnerUsername = $(channelContainerNode).text();

      videoOwnerUsername2 = $(videoOwnerNode).attr('href');
      videoOwnerUsername2 = ( videoOwnerUsername2.indexOf('user/') > -1 ) ? videoOwnerUsername2.split('user/')[1] : undefined;

      videoOwnerChannelName = $(channelContainerNode).attr('href');
      videoOwnerChannelName = ( videoOwnerChannelName.indexOf('channel/') > -1 ) ? videoOwnerChannelName.split('channel/')[1] : undefined;

      console.log('videoOwnerUsername',videoOwnerUsername,'videoOwnerUsername2',videoOwnerUsername2,'videoOwnerChannelName',videoOwnerChannelName);
      console.log('Video ID:', videoId);
      // Get the current data attributes off the tweed
      let actionButtonNode = $('#top-level-buttons');
      actionButtonNode = actionButtonNode.length ? actionButtonNode[0] : undefined;

      // Find the thumbs up button.  We will put the tipping icon just before it.
      let insertBeforeNode = $(actionButtonNode).find('ytd-toggle-button-renderer').first();
      insertBeforeNode = insertBeforeNode.length ? insertBeforeNode[0] : undefined;
      if (!insertBeforeNode) {
        console.log('cant seem to find where to insert this');
        return;
      }

      let permalinkPath = window.location.origin+window.location.pathname+'?v='+videoId;
      let platformUserId = videoOwnerChannelName+':' + (videoOwnerUsername || videoOwnerUsername2);

      // Note, we are treating comments differently because
      // not all comments make both identifiers available
      // for us to see.  This needs to be simplified before
      // release.
      let socialButtonParams = {
        platformUserId: platformUserId,
        userIdentType: 'ident',
        platformName: 'youtube',
        platformFeature: 'youtube-controls',
        contentId: permalinkPath
      };

      console.log('socialButtonParams',socialButtonParams);

      let modalInstance = new SocialTipButton(socialButtonParams);

      let element = $(modalInstance).insertBefore(insertBeforeNode);

      // Set the event listener that opens the tip dialog when clicked
      setClickListener(element);

    }

    // for (let oneNode of unprocessed) {

      // // Get the current data attributes off the tweed
      // let nodeData = $(oneNode).data();
      // let insertBeforeNode = $(oneNode).find('ytd-toggle-button-renderer').first();
      // insertBeforeNode = insertBeforeNode[0];
      // if (!insertBeforeNode) {
      //   console.log('cant seem to find where to insert this');
      //   return;
      // }

      // let modalInstance = new SocialTipButton({
      //   platformUserId: nodeData.userId,
      //   platformName: 'youtube',
      //   platformFeature: 'controls',
      //   contentId: nodeData.permalinkPath
      // });

      // let element = $(modalInstance).insertBefore(insertBeforeNode);

      // // // Set the event listener that opens the tip dialog when clicked
      // setClickListener(element);
    // }

  }

  // let controlsSelector = '#top-level-buttons';
  // let actionItems = $(controlsSelector);

  // if (!actionItems.length) {
  //   console.log('no top level buttons. returning');
  //   updating = false;
  //   return;
  // }

  // Add Icon for commenters


  // console.log('Processing Youtube page!', wallet.getAddress());
/*
  let actionSelector = '.tweet.js-actionable-tweet';

  let actionItems = $(actionSelector);

  let unprocessed = $(actionSelector+':not([readyfortips]');
  
  if (unprocessed.length) {
    console.log('There are',actionItems.length,'tweets on this page but only', unprocessed.length,'havent been processed.');
  }

  for (let oneNode of unprocessed) {

    // Mark this as processed
    $(oneNode).attr({ readyfortips: true });

    // Get the current data attributes off the tweed
    let nodeData = $(oneNode).data();
    let insertAfterNode = $(oneNode).find('.ProfileTweet-action--favorite:not(.u-hiddenVisually)');
    insertAfterNode = insertAfterNode[0];
    if (!insertAfterNode) {
      console.log('cant seem to find where to insert this');
      return;
    }

    let modalInstance = new SocialTipButton({
      platformUserId: nodeData.userId,
      platformName: 'youtube',
      contentId: nodeData.permalinkPath
    });

    let element = $(modalInstance).insertAfter(insertAfterNode);

    // // Set the event listener that opens the tip dialog when clicked
    setClickListener(element);

  }
*/
  updating = false;

}

$(document).ready(function(){
  processPage(true);
})