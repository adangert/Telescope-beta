/*

    Content script checking/watching Reddit related pages for places
    we can manipulate the DOM in order to add tipping functionality.

*/
var observer = new MutationObserver(function(mutations) {
    for (var i=0; i<mutations.length; i++) {
        var mutationAddedNodes = mutations[i].addedNodes;
        for (var j=0; j<mutationAddedNodes.length; j++) {
            var node = mutationAddedNodes[j];

            if (node.classList && node.classList.contains('ytd-item-section-renderer')) {

              return;

            }
        }
    }
});

observer.observe(document, {childList: true, subtree: true});

$(document).ready(function () {
  console.log('We did it.  We are on a reddit page');
});
