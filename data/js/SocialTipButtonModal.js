(function (window) {

const base64icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gIPBg8q7VX6tAAAArVJREFUOMtdk0toU1EQhr9zbm5yU1qNRtMqVqlgBVEobXHpC6HU4quI7lSwttCtD0QUxZ2IC8FNQfGJRVTQovgArRtXBlHQKi5aEVtrH0ZM2iY5955xoUkaz2oYZub8/z//KGa9Ha/bnLgXX5DK/tprld0kIg2AaMVbjdMfd+PXR83oRF/z46DQowrB7uTOSh//sBFzSkQQBBFBK02pWOFq97RW+vzdpgeZ4oA9yfbKvOSvGDG7ALI2i6c9aiKL+J4bQZX+ASCkQ7dd5XbcabqfcbYlWx3gmBHTDWCsYVv1Duoq6lhRWc+XmSFGc6N4jlccZMWuVkplV3XVv1IH3u1LjOV+/PgLGibz47Qm2uha1k02yJKIJJjIjXPk0yGm/EwZnZg7L+HUdSztCiRosVgqnCg9ay6zvaYdheLJ2CO+zQzTHFtL3J1P/+QLXO2WuCgZ0RbZBKDR5IIcJz8f5+n4Y/I2z/PJF/SN3ScTpEmZXzjaKdPCF3+zs/LgirOCnVNIpoM0xuZpq95KTaSGxrlNzHVjJCIJjPgMpD8UUTg4EV2uL7jK5e3vN39j7XLpaw/d7ztZ4tXSUdv5T6mSCbRS6t1/M/AlYCA9wFQwxXBumJaFrWil+TI9iBFTrLPI+5AS1Q+0FZKCsCRai1Kwbv4G1q3dQMqkuP29l8tfe4iFYkUUIRV6rqvcOddnG8UXn4aqBsI6zKfMR258u8rQ9CAXhy7g6WixWaGo0NGbzvKDy3JaaazY9QCOcviYGaB35BZZO/NvAz8Zmh4ss3VYh08ZzDMFsCu5vdIX/5ovfvtsoxT4GjFEdbQktHbvedrb39t4N1PEvifZXpXHHPWtOVGmNPx/TGciOnyut/FepuwaAba8bnEWRxZVp/I/9wYEGxGaAUGR1OiXsVDs6oSfGu9rflg85z8xLSrRxVoGewAAAABJRU5ErkJggg==';

function SocialTipButton(options) {
  let self = this;

  for (let oneKey in options) {
    this[oneKey] = options[oneKey];
  }

  let buttonHtml;
  // If there are multiple tip buttons per platform, look
  // first for the feature.  Otherwise use the plaform name.
  switch (options.platformFeature || options.platformName) {
    case 'twitter':

      buttonHtml = [
        '<div class="ProfileTweet-action"',
        ' id="telescope_social_button"',
        ' data-platformname="twitter"',
        ' data-platformuserid="'+options.platformUserId+'"',
        ' data-contentid="'+options.contentId+'">',
        '   <img class="ProfileTweet-actionButton" border="0" style="cursor:pointer" alt="Tip BCH" src="'+base64icon+'" width="18" height="18">',
        '   <span id="tipscash-amount-tipped" style="font-size:.9rem;color:black;padding:5px;"></span>',
        '</div>'
      ].join('\n');

    break;
    case 'youtube-controls':

      buttonHtml = [
        '<span',
        ' id="telescope_social_button"',
        ' data-platformname="youtube"',
        ' data-platformuserid="'+options.platformUserId+'"',
        ' data-contentid="'+options.contentId+'"',
        ' class="style-scope ytd-menu-renderer force-icon-button style-default size-default">',
        ' <a class="yt-simple-endpoint style-scope ytd-button-renderer" tabindex="-1">',
        '   <img src="'+base64icon+'" width="25" height="25">',
        ' </a>',
        ' <span id="tipscash-amount-tipped" style="font-size:1rem;color:black;">$</span>',
        '</span>'
      ].join('\n');

    break;
    case 'youtube-comments':

      buttonHtml = [
        '<span',
        ' id="telescope_social_button"',
        ' data-platformname="youtube"',
        ' data-platformuserid="'+options.platformUserId+'"',
        ' data-contentid="'+options.contentId+'"',
        ' class="style-scope ytd-menu-renderer force-icon-button style-default size-default">',
        ' <a class="yt-simple-endpoint style-scope ytd-button-renderer" tabindex="-1">',
        '   <img src="'+base64icon+'" width="25" height="25">',
        ' </a>',
        ' <span id="tipscash-amount-tipped" style="font-size:1rem;color:black;">$</span>',
        '</span>'
      ].join('\n');

    break;

    case 'reddit':

      buttonHtml = [
        '<li',
        ' id="telescope_social_button"',
        ' data-platformname="reddit"',
        ' data-platformuserid="'+options.platformUserId+'"',
        ' data-contentid="'+options.contentId+'"',
        ' style="padding:5px;cursor:pointer"',
        ' class="">',
        ' <a alt="Tip BCH" class="">',
        '   <img src="'+base64icon+'" width="15" height="15">',
        ' </a>',
        ' <span id="tipscash-amount-tipped" style="font-size:.9rem;color:black;">$</span>',
        '</li>'
      ].join('\n');

    break;

    default:
      buttonHtml = [
        '',
        '',
        ''
      ].join('\n');

    break;  }

  let domNode = $(buttonHtml);

  _.extend(this, domNode);

  this.updateInterval = setInterval(_.bind(this.update, this), 8000);

  this.update.call(this);

  this._ = _;

  this.util = util;

  // if (!io || !io.socket) {
  //   return;
  // }

//   io.socket.on('tip', function(tipData) {
//     console.log('new tip!', tipData);
// console.log('checking against', self);
//     if (tipData.contentId == self.contentId) {
//       console.log('This is our tip.  Lets update!');
//       self.update();
//     }
//     else {
//       console.log('this is someone elses tip!');
//     }

//   });

//   // io.socket.get('https://tipscash.herokuapp.com/listen/events/tip,price');
//   io.socket.get('http://localhost:1337/listen/events/tip,price');

  return this;
}

SocialTipButton.prototype.update = async function() {
  let self = this;

  let amountTippedNode = $(this).find('#tipscash-amount-tipped');
  amountTippedNode = amountTippedNode[0];

  $(amountTippedNode).text('...');
  let pastTipsUrl = 'https://tipscash.herokuapp.com/tips/'+this.platformName+'/id/'+encodeURIComponent(this.contentId);
  let pastTips;
  try {
    pastTips = await util.getJSON(pastTipsUrl);
  }
  catch(nope) {
    console.log('Cannot fetch past tips from', pastTipsUrl,':', nope);
    console.log('Giving up on this content.');
    clearInterval(self.updateInterval);
    return false;
  }

  let newAmount = Number(pastTips.amountUSD.toFixed(2));
  newAmount = newAmount ? newAmount : '0';

  $(amountTippedNode).text('$'+newAmount);

  // If this content has been tipped, style it!
  if (newAmount > 0 && this.styleParentSelector && this.styleParentCSS) {
    $(this).closest(this.styleParentSelector).css(this.styleParentCSS);
  }

  return;

};

window.SocialTipButton = SocialTipButton;

})(window);
