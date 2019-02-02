/**
 * paypopup.js
 * Copyright (c) 2018- Aaron Angert
 * Copyright (c) 2014-2018 Andrew Toth
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the MIT license.
 *
 * Controls paypopup.html, the popup that appears when clicking on bitcoin pay links,
 * or by clicking the context menu
 */

$(document).ready(function () {
    var SATOSHIS = 100000000,
    //FEE = SATOSHIS * .0001,
    BCHUnits = 'BCH',
    BCHMultiplier = SATOSHIS,
    clickX,
    clickY,
    port = null;
    one_popup = true;

    // var req = new XMLHttpRequest();
    // req.open('GET', 'https://blockdozer.com/insight-api/utils/estimatefee/', false);
    // req.send(null);
    // //var FEE = SATOSHIS * .0001;
    // var FEE = Math.round(SATOSHIS * JSON.parse(req.response)[2]);
    var FEE = wallet.getFee();

    // Event is broadcast when context menu is opened on the page
    $(document).on('contextmenu', function (e) {
        // Save the position of the right click to use for positioning the popup
        clickX = e.clientX;
        clickY = e.clientY;
        if (typeof chrome !== 'undefined') {
            // In Chrome we open a port with the background script
            // to tell us when the menu item is clicked
            if (port) {
                port.disconnect();
            }
            port = chrome.runtime.connect();
            port.onMessage.addListener(function(response) {
                var rect = null;
                if (response.address) {
                    // We only have an address in Chrome if it was selected by right clicking,
                    // so we can get the location of the address by finding the selection
                    rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
                }
                showPopup(response.address, null, rect);
            });
        }
    });

    if (typeof chrome === 'undefined') {
        // In Firefox we listen for the pay message to be sent
        self.port.on('pay', function (message) {
            if (message.address) {
                // If we have an address, the position of the address is sent as well
                var rect = {};
                rect.left = message.left;
                rect.right = message.right;
                rect.top = message.top;
                rect.bottom = message.bottom;
                showPopup(message.address, null, rect);
            } else {
                showPopup(null, null, null);
            }
        });
    }

    // $('body').on('mouseover', 'iframe', function (e) {
    //   var src = $(this).attr('src');
    //   if (/^https:\/\/www.moneybutton.com.*/.test(src)) {
    //     var moneybutton_address = src.match(/(q|p)[0-9a-zA-Z]{40,44}/)[0]
    //     if(one_popup){
    //       one_popup = false;
    //     showPopup(moneybutton_address, null, this.getBoundingClientRect());
    //     }
    //   }
    // });


    $('body').on('mouseover', 'a', function (e) {
      var href = $(this).attr('href');
      var rect =  this.getBoundingClientRect();
      if ( document.URL.includes("bitpay.com") ) {
        if (/bitcoincash:\?r=https:\/\/bitpay.com\/i\/[0-9a-zA-Z]{20,46}/.test(href)) {
          var amount = 0
          var bit_pay_address = href.match(/https.*/)[0]
          var what = util.getHeaders(bit_pay_address,{"Accept":"application/payment-request"}).then(function (data) {
              var json_data = JSON.parse(data)
              bch_amount = json_data["outputs"][0]["amount"];
              if(one_popup){
                one_popup = false;
              showPopup(json_data["outputs"][0]["address"], 1, rect,bit_pay_address, bch_amount );
              }
              //resolve();
          }, function () {
              reject(Error('Unknown error'));
          });
          // console.log(return_json);
          return false;
        }
      }
    });


    $('body').on('mouseenter', 'button', function (e) {
      var rect =  this.getBoundingClientRect();
      var button_class = $(this).attr('class');
      if(button_class == "pay-button"){
        var amount = $(this).attr('amount');
          var address = $(this).attr('address');
          var amountType = $(this).attr('amount-type');



          if (/^(bitcoincash:)?(Q|P|p|q)[0-9a-zA-Z]{38,46}$/.test(String(address))) {

            if(amountType == "BCH"){
              showPopup(address, amount, rect, undefined, amount*100000000);

            }
            else if (amountType == "Satoshi") {
              showPopup(address, amount, rect, undefined, amount);
            }else{


            util.getJSON("https://index-api.bitcoin.com/api/v0/cash/price/" + amountType).then(function (response) {
              console.log(response);

              if (response.price != "") {
                  //determine amount of satoshi based on button value
                  var addDecimal = response.price / 100;
                  var satoshiAmount = Math.floor((100000000 / addDecimal) * amount);
                  console.log(satoshiAmount);
                  showPopup(address, satoshiAmount, rect, undefined, satoshiAmount);
                  // var showSatoshi = satoshiAmount / 100000000;
                  // showSatoshi = showSatoshi.toPrecision(7);
                  // console.log(showSatoshi);
                  //var pricePersatoshi = addDecimal / 100000000;
                }
        });
      }
      }
        return true;
      }



      //
      // var href = $(this).attr('href');
      // var rect =  this.getBoundingClientRect();
      // if ( document.URL.includes("bitpay.com") ) {
      //   if (/bitcoincash:\?r=https:\/\/bitpay.com\/i\/[0-9a-zA-Z]{20,46}/.test(href)) {
      //     var amount = 0
      //     var bit_pay_address = href.match(/https.*/)[0]
      //     var what = util.getHeaders(bit_pay_address,{"Accept":"application/payment-request"}).then(function (data) {
      //         var json_data = JSON.parse(data)
      //         bch_amount = json_data["outputs"][0]["amount"];
      //         if(one_popup){
      //           one_popup = false;
      //         showPopup(json_data["outputs"][0]["address"], 1, rect,bit_pay_address, bch_amount );
      //         }
      //         //resolve();
      //     }, function () {
      //         reject(Error('Unknown error'));
      //     });
      //     // console.log(return_json);
      //     return false;
      //   }
      // }
    });


    let openTipsCashPopup = async function(youtubeData, rect) {

      // URI encode this field before we send it off for encryption
      // so it doesn't get mangled by the webserver's body parser.
      let encodedOpreturn = encodeURIComponent('tipscash::youtube::'+youtubeData.contentident);

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

      let fetchAccountUri = 'https://tipscash.herokuapp.com/search/youtube/' + youtubeData.useridenttype +'/'+youtubeData.userident;

      let tipscashAccount;
      try {
        tipscashAccount = await util.getJSON(fetchAccountUri);
        tipscashAccount = tipscashAccount[0];
      }
      catch(nope) {
        console.log('Cannot fetch tipscash account for ', fetchAccountUri, ':', nope);
        return false
      }

      showPopup(tipscashAccount['cashAddress'], null, rect, undefined, undefined, opreturnString);

    };

    // Intercept all anchor clicks and determine if they are bitcoin pay links
    $('body').on('click', 'a', function (e) {
        var href = $(this).attr('href');
        var rect =  this.getBoundingClientRect();
        var id = $(this).attr('id')

        if(id == 'telescope_youtube_button'){

          openTipsCashPopup($(this).data(), rect);
          return false;
        }

        // Regex test for bitpay links
        if (/^bitcoincash:\?r=https:\/\/bitpay.com\/i\/[0-9a-zA-Z]{20,46}/.test(href)) {
          var amount = 0
          // return false;
          var bit_pay_address = href.match(/https.*/)[0]
          var what = util.getHeaders(bit_pay_address,{"Accept":"application/payment-request"}).then(function (data) {
              var json_data = JSON.parse(data)
              bch_amount = json_data["outputs"][0]["amount"];
              showPopup(json_data["outputs"][0]["address"], 1, rect,bit_pay_address, bch_amount);
              resolve();
          }, function () {
              reject(Error('Unknown error'));
          });
          return false;
        }


        // Regex test for bitcoin pay link
        if (/^(bitcoincash:)?(Q|P|p|q)[0-9a-zA-Z]{38,46}/.test(href)) {
            var addresses = href.match(/(bitcoincash:)?(Q|P|p|q)[0-9a-zA-Z]{38,46}/);
            var address = null;
            if (addresses) {
                address = addresses[0];
            }
            var amounts = href.match(/amount=\d+\.?\d*/);
            var amount = null;
            if (amounts) {
                amount = Number(amounts[0].substring(7)) * SATOSHIS;
            }
            showPopup(address, amount, this.getBoundingClientRect());
            return false;
        }
        // Return true if not a bitcoin link so click will work normally
        return true;
    });

    //amount is in local currency
    //if bch_amount != undefined, use that instead of amount
    function showPopup(address, amount, rect, bitpay_url, bch_amount, include_opreturn) {
        // removeFrame();
        util.iframe('paypopup.html').then(function (iframe) {

            iframe.style.height = '210px';
            iframe.style.width = '235px';
            var offset = {}
            if (rect) {
                offset.left = Number(rect.left) + Number(window.pageXOffset) + Number(rect.right-rect.left)/2 - 85;
                offset.top = Number(rect.bottom) + Number(window.pageYOffset);
            } else {
                offset.left = Number(clickX) + Number(window.pageXOffset);
                offset.top = Number(clickY) + Number(window.pageYOffset);
            }
            iframe.style.left = offset.left + 'px';
            iframe.style.top = offset.top + 'px';

            var $iframe = $(iframe.contentWindow.document);

            wallet.restoreAddress().then(function () {
                if (wallet.isEncrypted()) {
                    // Only show password field if the wallet is encrypted
                    $iframe.find('#password').parent().show();
                }
            }, function () {
                wallet.generateAddress();
            });

            preferences.getBCHUnits().then(function (units) {
                BCHUnits = units;
                BCHMultiplier = SATOSHIS;
                // if (units === 'µBCH') {
                //     BCHMultiplier = SATOSHIS / 1000000;
                // } else if (units === 'mBCH') {
                //     BCHMultiplier = SATOSHIS / 1000;
                // } else {
                //     BCHMultiplier = SATOSHIS;
                // }
            });

            preferences.getCurrency().then(function (units) {
              $iframe.find('#amount').attr('placeholder', 'Amount (' + units + ')').attr('step', 100000 / BCHMultiplier);
              // console.log(currencyManager.formatPureAmount(0.25));
              // $iframe.find('#button1').text(currencyManager.formatPureAmount(0.25));
              // .attr('placeholder', 'Amount (' + units + ')').attr('step', 100000 / BCHMultiplier);

            });

            currencyManager.addSymbol(0.25).then(function(amount){
              $iframe.find('#button1').text(amount);
            });

            currencyManager.addSymbol(0.5).then(function(amount){
              $iframe.find('#button2').text(amount);
            });

            currencyManager.addSymbol(1).then(function(amount){
              $iframe.find('#button3').text(amount);
            });

            currencyManager.addSymbol(5).then(function(amount){
              $iframe.find('#button4').text(amount);
            });


            // Check if the address is actually valid
            if (!address || !/^(bitcoincash:)?(Q|P|p|q)[0-9a-zA-Z]{38,46}$/.test(String(address))) {
                address = null;
            } else {
                try {

                  //var new_address = '';
                  if (address.indexOf("bitcoincash:") == -1){
                    address = 'bitcoincash:'+address;
                  }

                  new bch.Address.fromString(address,'livenet', 'pubkeyhash', bch.Address.CashAddrFormat);

                    //new Bitcoin.Address(address);
                } catch (e) {
                    address = null;
                }
            }

            // Hide the address field if we have a valid address,
            // else hide the arrow pointing to an address
            if (address) {
                $iframe.find('#address').val(address).parent().hide();
            } else {
                $iframe.find('.arrow').hide();
            }

            // Hide the amount field if we have a valid amount
            if (amount) {
                $iframe.find('#amount').parent().hide();
                $iframe.find('#default-tip').hide();
                updateButton(amount);
            } else {
                $iframe.find('#amount').on('keyup change', function () {
                    var value = $iframe.find('#amount').val();//Math.floor(Number($iframe.find('#amount').val() * BCHMultiplier));
                    updateButton(value);
                });
            }

            function updateButton(value) {
              if (typeof bch_amount != 'undefined'){
                currencyManager.formatAmount(bch_amount).then(function (formattedMoney) {
                    var text = 'Send';

                    if (value > 0) {
                        text += ' (' + formattedMoney + ')';
                    }
                    $iframe.find('#button').text(text);
                });
              } else
              {
                currencyManager.formatBCH(value).then(function (formattedMoney) {
                    var text = 'Send';

                    if (value > 0) {
                        text += ' (' + formattedMoney + ')';
                    }
                    $iframe.find('#button').text(text);
                });
              }
            }

            $iframe.find('#main').fadeIn('fast');

            $iframe.find('#button').click(function(){sendAmount()} );
            $iframe.find('#button1').click(function(){sendAmount(0.25)} );
            $iframe.find('#button2').click(function(){sendAmount(0.5)} );
            $iframe.find('#button3').click(function(){sendAmount(1)} );
            $iframe.find('#button4').click(function(){sendAmount(5)} );

            $(document).on('click.wallet contextmenu.wallet', removeFrame);

            function removeFrame() {
                one_popup = true;
                $(document).off('click.wallet contextmenu.wallet');
                $(iframe).fadeOut('fast', function () {
                    $(this).remove();
                });
            }

            function sendAmount(amountToSend){
                var validAmount = true,
                    validAddress = true,
                    newAmount,
                    sending_amount = 0;
                if(typeof amountToSend != 'undefined'){
                  sending_amount = amountToSend;
                }else{
                  sending_amount = $iframe.find('#amount').val()
                }
                currencyManager.BCHvalue(sending_amount).then(function(newBchAmount){
                //if we have a bch amount specified use that, otherwise use the
                //local currency amount.
                if (typeof bch_amount != 'undefined'){
                  newAmount = bch_amount;
                }else{
                  if (!amount) {
                      newAmount = Math.floor(Number(newBchAmount * BCHMultiplier));
                  } else {
                      newAmount = amount;
                  }
                }
                var balance = wallet.getBalance();
                if (newAmount <= 0) {
                    validAmount = false;
                } else if (newAmount + FEE > balance) {
                    validAmount = false;
                }

                var newAddress;
                if (!address) {
                    newAddress = $iframe.find('#address').val();
                    if (!/^(bitcoincash:)?(Q|P|p|q)[0-9a-zA-Z]{38,46}$/.test(String(newAddress))) {
                        validAddress = false;
                    } else {
                        try {

                          //var new_address = '';
                          if (newAddress.indexOf("bitcoincash:") == -1){
                            newAddress = 'bitcoincash:'+newAddress;
                          }

                          new bch.Address.fromString(newAddress,'livenet', 'pubkeyhash', bch.Address.CashAddrFormat);

                            //new Bitcoin.Address(newAddress);
                        } catch (e) {
                            validAddress = false;
                        }
                    }
                } else {
                    newAddress = address;
                }
                $iframe.find('#amount').parent().removeClass('has-error');
                $iframe.find('#address').parent().removeClass('has-error');
                $iframe.find('#password').parent().removeClass('has-error');
                if (!validAddress) {
                    $iframe.find('#errorAlert').text('Invalid address').slideDown();
                    $iframe.find('#address').parent().addClass('has-error');
                } else if (!validAmount) {
                    $iframe.find('#errorAlert').text('Insufficient funds').slideDown();
                    $iframe.find('#amount').parent().addClass('has-error');
                } else if (!navigator.onLine) {
                    $iframe.find('#errorAlert').text('Connection offline').slideDown();
                    $iframe.find('#amount').parent().addClass('has-error');
                } else {
                    $(document).off('click.wallet contextmenu.wallet');
                    $iframe.find('#errorAlert').slideUp();
                    $iframe.find('#default-tip').fadeOut('fast');
                    $iframe.find('#amount').parent().fadeOut('fast');
                    $iframe.find('#address').parent().fadeOut('fast');
                    $iframe.find('#password').parent().fadeOut('fast');
                    $iframe.find('#button').fadeOut('fast', function () {
                        $iframe.find('#progress').fadeIn('fast', function () {
                          var use_fee = wallet.getFee();
                          //update this at some point to use the bitpay fee
                           // if (typeof bitpay_fee != 'undefined'){
                           //   use_fee = bitpay_fee;
                           // }
                            wallet.send(newAddress, newAmount, use_fee, $iframe.find('#password').val(), bitpay_url, undefined/* This param is only for memo style opreturns */, include_opreturn).then(function () {
                                $iframe.find('#progress').fadeOut('fast', function () {
                                    $iframe.find('#successAlert').fadeIn('fast').delay(1000).fadeIn('fast', removeFrame);
                                });
                            }, function (e) {
                                $iframe.find('#progress').fadeOut('fast', function () {
                                    if (e.message === 'Incorrect password') {
                                        $iframe.find('#password').parent().addClass('has-error');
                                    } else if (e.message === 'Insufficient funds') {
                                        $iframe.find('#amount').parent().addClass('has-error');
                                    }
                                    $iframe.find('#errorAlert').text(e.message).slideDown();
                                    if (!address) {
                                        $iframe.find('#address').parent().fadeIn();
                                    }
                                    if (!amount) {
                                        $iframe.find('#amount').parent().fadeIn();
                                    }
                                    if (wallet.isEncrypted()) {
                                        $iframe.find('#password').parent().fadeIn();
                                    }
                                    $iframe.find('#button').fadeIn();
                                    $(document).on('click.wallet contextmenu.wallet', removeFrame);
                                });
                            });
                        });
                    });
                }
                });
            }













        });
    }


});
