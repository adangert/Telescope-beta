/*

    Content script checking/watching Twitter related pages for places
    we can manipulate the DOM in order to add tipping functionality.

*/
var observer = new MutationObserver(function(mutations) {
  processPage();
});


let openTipsCashPopup = async function(someHtmlElement, rect) {

  let nodeData = $(someHtmlElement).data();

  // URI encode this field before we send it off for encryption
  // so it doesn't get mangled by the webserver's body parser.
  let encodedOpreturn = encodeURIComponent('tdc::'+nodeData.platformname+'::'+nodeData.contentid);

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

  window.showPopup(tipscashAccount['cashAddress'], null, rect, undefined, undefined, opreturnString);

};



var setClickListener = function(someNode) {

  // DONT FUCK WITH PUSH NOTIFICATIONS.
  // JUST FETCH THE FUCKING DATA AFTER 
  // WE SUBMIT THE TRANSACTION.

  $(someNode).on('click', function (event) {
    console.log('CLICKED!!!!!!!')
    var nodeData = $(this).data();
    var rect =  this.getBoundingClientRect();

    openTipsCashPopup(someNode, rect);
    event.stopPropagation();
    event.preventDefault();
    return false;

  });
}

observer.observe(document, {childList: true, subtree: true});
var updating = false;
var processPage = async function() {
  if (updating) {
    return;
  }
  else {
    updating = true;
  }

  // console.log('Processing Twitter page!', wallet.getAddress());

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
      platformName: 'twitter',
      contentId: nodeData.permalinkPath,
      styleParentSelector: '.tweet.js-actionable-tweet',
      styleParentCSS: {
        'background-color': 'rgba(255,153,0,.6)',
        'border-radius': '10px',
        'padding': '12px'
      }
    });

    let element = $(modalInstance).insertAfter(insertAfterNode);


    // Set the event listener that opens the tip dialog when clicked
    setClickListener(element);

  }

  updating = false;

}

$(document).ready(processPage)