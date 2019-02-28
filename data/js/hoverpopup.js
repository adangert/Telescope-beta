/**
 * hoverpopup.js
 * Copyright (c) 2018- Aaron Angert
 * Copyright (c) 2014-2018 Andrew Toth
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the MIT license.
 *
 * Controls hoverpopup.html, the popup that appears hovering over addresses
 */
//window.onload = function () { alert("It's loaded!") }
// var observer = new MutationObserver(function(mutations) {
// // console.log(mutations);
//     for (var i=0; i<mutations.length; i++) {
//         var mutationAddedNodes = mutations[i].addedNodes;
//         for (var j=0; j<mutationAddedNodes.length; j++) {
//             var node = mutationAddedNodes[j];

//               if (node.classList && node.classList.contains('ytd-item-section-renderer')) {

//                   // If this node contains no descendants that match
//                   // the one we're looking for, move along.
//                   var authorText = $(node).find('a#author-text');
//                   if (!authorText.length) {
//                     continue;
//                   }
//                   authorText = authorText[0] && authorText[0].href;
//                   var userIdentType;
//                   if (authorText.indexOf('/user/') > -1) {
//                     userIdentType = 'user';
//                     userIdent = authorText.split('/user/')[1];
//                   }
//                   else if (authorText.indexOf('/channel/') > -1) {
//                     userIdentType = 'channel';
//                     userIdent = authorText.split('/channel/')[1];
//                   }
//                   else {
//                     console.log('idfk whats goin on man');
//                   }

//                   // Now grab youtube's identifier for this piece of content
//                   var contentIdent = $(node).find('yt-formatted-string.published-time-text').find('a');
//                   contentIdent = contentIdent.length ? contentIdent[0].href : undefined;

//                   console.log('User will be identified by', userIdentType, 'as', userIdent, 'for content with id', contentIdent);

//                   // console.log(node.insertAdjacentText('beforebegin',"YO DAWG"));
//                   var lengthNode = document.createElement('a');
//                   var lengthNodeText = document.createTextNode('Inserted Telescope Text POC');
//                   $( '<a id="telescope_youtube_button" href="'+authorText+'" data-userIdent="'+userIdent+'" data-userIdentType="'+userIdentType+'" data-contentIdent="'+contentIdent+'"><img border="0" alt="W3Schools" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gIPBg8q7VX6tAAAArVJREFUOMtdk0toU1EQhr9zbm5yU1qNRtMqVqlgBVEobXHpC6HU4quI7lSwttCtD0QUxZ2IC8FNQfGJRVTQovgArRtXBlHQKi5aEVtrH0ZM2iY5955xoUkaz2oYZub8/z//KGa9Ha/bnLgXX5DK/tprld0kIg2AaMVbjdMfd+PXR83oRF/z46DQowrB7uTOSh//sBFzSkQQBBFBK02pWOFq97RW+vzdpgeZ4oA9yfbKvOSvGDG7ALI2i6c9aiKL+J4bQZX+ASCkQ7dd5XbcabqfcbYlWx3gmBHTDWCsYVv1Duoq6lhRWc+XmSFGc6N4jlccZMWuVkplV3XVv1IH3u1LjOV+/PgLGibz47Qm2uha1k02yJKIJJjIjXPk0yGm/EwZnZg7L+HUdSztCiRosVgqnCg9ay6zvaYdheLJ2CO+zQzTHFtL3J1P/+QLXO2WuCgZ0RbZBKDR5IIcJz8f5+n4Y/I2z/PJF/SN3ScTpEmZXzjaKdPCF3+zs/LgirOCnVNIpoM0xuZpq95KTaSGxrlNzHVjJCIJjPgMpD8UUTg4EV2uL7jK5e3vN39j7XLpaw/d7ztZ4tXSUdv5T6mSCbRS6t1/M/AlYCA9wFQwxXBumJaFrWil+TI9iBFTrLPI+5AS1Q+0FZKCsCRai1Kwbv4G1q3dQMqkuP29l8tfe4iFYkUUIRV6rqvcOddnG8UXn4aqBsI6zKfMR258u8rQ9CAXhy7g6WixWaGo0NGbzvKDy3JaaazY9QCOcviYGaB35BZZO/NvAz8Zmh4ss3VYh08ZzDMFsCu5vdIX/5ovfvtsoxT4GjFEdbQktHbvedrb39t4N1PEvifZXpXHHPWtOVGmNPx/TGciOnyut/FepuwaAba8bnEWRxZVp/I/9wYEGxGaAUGR1OiXsVDs6oSfGu9rflg85z8xLSrRxVoGewAAAABJRU5ErkJggg==" width="15" height="15"></a>' ).insertBefore(node.querySelector("#reply-button-end"))
//                   // node.querySelector("#author-text").appendChild(lengthNodeText);
//                   // node.appendChild(lengthNode);
//                   // console.log(node.);
//                   // console.log(mutations);
//                   // observer.disconnect();
//               }

//             // if (node.classList && node.classList.contains("timestamp")) {
//             //     var videoLength = node.firstElementChild.innerText;
//             //     observer.disconnect();
//             //
//             //     var lengthNode = document.createElement("li");
//             //     var lengthNodeText = document.createTextNode(videoLength);
//             //     lengthNode.appendChild(lengthNodeText);
//             //     document.getElementsByClassName("pl-header-details")[0].appendChild(lengthNode);
//             //
//             //     return;
//             // }
//         }
//     }
// });
// observer.observe(document, {childList: true, subtree: true});
$(document).ready(function () {
    // Recursively walk through the childs, and push text nodes in the list
    //console.log("walking through everything")
    var textNodes = [];
    (function recursiveWalk(node) {
        if (node) {
            node = node.firstChild;
            while (node != null) {
                if (node.nodeType == 3) {
                    textNodes.push(node);
                    // console.log(node['textContent'])
                } else if (node.nodeType == 1) {
                    if(node.tagName != 'A'){
                    recursiveWalk(node);
                  }
                }
                node = node.nextSibling;
            }
        }
    })(document.body);

    // Check all text nodes for addresses
    for (var i = textNodes.length-1; i>=0; i--) {

        var matches = textNodes[i]['textContent'].match(/(bitcoincash:)?(Q|P|p|q)[0-9a-zA-Z]{38,46}/g);
        if (matches) {
            var text = textNodes[i]['textContent'],
                hasMatch = false;
            for (var j = 0; j < matches.length; j++) {
                try {
                    var new_address = '';
                    if (matches[j].indexOf("bitcoincash:") == -1){
                      new_address = 'bitcoincash:'+matches[j];
                    }else{
                      new_address = matches[j];
                    }

                    new bch.Address.fromString(new_address,'livenet', 'pubkeyhash', bch.Address.CashAddrFormat);
                    //new Bitcoin.Address(matches[j]);
                    // If we're here, then this node has a valid address
                    hasMatch = true;
                    // Wrap the address in the 'bitcoin-address' class
                    //text = text.replace(matches[j], '<span class="bitcoin-address">' + matches[j] + '</span>');
                    text = text.replace(matches[j], '<span class="bitcoin-address"><a href="'+new_address+'">' + matches[j] + '</a></span>');
                    //text = text.replace(matches[j], 'oooompa');
                } catch (e) {}
            }
            if (hasMatch) {
                // Replace the node with the wrapped bitcoin addresses HTML
                var replacementNode = document.createElement('span'),
                    node = textNodes[i];
                //this wraps bitcoin cash addresses with hrefs
                //i.e. in the above comment:
                //<span class="bitcoin-address"><a href="'+matches[j]+'">' + matches[j] + '</a></span>
                var sanitized_text  = sanitizeHtml(text,{
                  allowedTags: ['span', 'a' ],
                  allowedSchemes: [ 'bitcoincash' ],
                  allowedAttributes: {
                    'a': [ 'href' ],
                    'span': ['class']
                  }
                });
              //console.log(sanitized_text);

                replacementNode.innerHTML = sanitized_text;
                node.parentNode.insertBefore(replacementNode, node);
                node.parentNode.removeChild(node);
            }
        }
    }

    // We only want to open the popup once per address to not annoy the user,
    // so cache the addresses
    var openPopups = {};
    // Open the address when we hover on a 'bitcoin-address' wrapped element
    // $('.bitcoin-address').hover(function () {
    //     var address = $(this).text();
    //     if (address.indexOf("bitcoincash:") == -1){
    //       address = 'bitcoincash:'+address;
    //     }
    //     var rect = this.getBoundingClientRect();
    //     if (!openPopups[address]) {
    //         // Cache the address
    //         openPopups[address] = {};
    //         util.iframe('hoverpopup.html').then(function (iframe) {
    //             var height = 66;
    //             iframe.style.height = height + 'px';
    //             iframe.style.width = '240px';
    //             iframe.style.left = Number(rect.left) + Number(window.pageXOffset) + Number(rect.right - rect.left)/2 - 105 + 'px';
    //             iframe.style.top = Number(rect.top) + Number(window.pageYOffset) - height + 'px';
    //             var $iframe = $(iframe.contentWindow.document);
    //             $iframe.find('#main').fadeIn('fast');
    //             util.getJSON('https://blockdozer.com/insight-api/addr/' + address + '?nocache='+ new Date().getTime()).then(function (json) {
    //                 return Promise.all([currencyManager.formatAmount(json.totalReceivedSat), currencyManager.formatAmount(json.balanceSat)]);
    //             }).then(function (amounts) {
    //                 $iframe.find('#progress').fadeOut('fast', function () {
    //                     $iframe.find('#received').fadeIn('fast').html('Total received: <span class="float-right">' + amounts[0] + '</span>');
    //                     $iframe.find('#balance').fadeIn('fast').html('Final balance: <span class="float-right">' + amounts[1] + '</span>');
    //                 });
    //             });
    //             $iframe.find('#infoButton').click(function () {
    //                 // Different APIs to open tabs in Chrome and Firefox
    //                 if (typeof chrome !== 'undefined') {
    //                     chrome.runtime.sendMessage({address: address})
    //                 } else {
    //                     self.port.emit('openTab', 'https://bch-insight.bitpay.com/address/' + address);
    //                 }
    //             });
    //             $iframe.find('#closeButton').click(function () {
    //                 $(iframe).fadeOut('fast', function () {
    //                     $(this).remove();
    //                 });
    //             });
    //         });
    //     }
    // });

});
