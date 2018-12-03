// ==UserScript==
// @name         Avabur highlight cheap scrap items in market
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlighting weapons and armor market listings: cheaper then their scrap crafting material value => green ; more expensive then their scrap crafting material value => red .
// @author       Akerus aka Takeces
// @match        https://*.avabur.com/game*
// @grant        GM_addStyle
// ==/UserScript==

(function() {

    /**************************************************/
    /****************** CSS STYLING *******************/
    /**************************************************/
    GM_addStyle('table.marketListings tr.cheap {background-color: #188224;}');
    GM_addStyle('table.marketListings tr.not-cheap {background-color: #4a0e0a;}');


    /**************************************************/
    /****************** USER OPTIONS ******************/
    /**************************************************/
    // change this value to your preferred one
    var CRAFTING_MATERIAL_PRICE = 1600;

    /**************************************************/
    /******************* FUNCTIONS ********************/
    /**************************************************/

    /**
     * Function called by click on buttons.
     * Have to set a timeout because content will be replaced after this function has been run.
     **/
    function callMarkListings() {
        setTimeout(markListings, 1000);
    }

    /**
     * Function for highlighting items in market.
     **/
    function markListings(event) {
        // try to find an item with tooltip (weapon or armor)
        var oNewItem = jQuery(event.target).find('.itemWithTooltip');

        // if weapon or armor found -> highlight
        if(oNewItem.length !== 0){
            // calculate the expected crafting materials (level + quality)
            var oJson = oNewItem.data('json');
            var iLevel = oJson.l;
            // important are the level-blocks (in increments of 10)
            var iLevelCalc = Math.floor(iLevel/10);
            // quality starts with 0 -> add 1
            var iQuality = oJson.q + 1;
            var iCraftingMaterials = iLevelCalc + iQuality;

            // get price of item
            var sPrice = oNewItem.parents('tr').find('td[data-th="Price"]').text();
            var iPrice = parseInt(sPrice.replace(/\,/g,''));

            // get price per crafting material of this item
            var fPricePerMat = iPrice / iCraftingMaterials;

            // check with our crafting material price
            if(fPricePerMat <= CRAFTING_MATERIAL_PRICE) {
                // mark as cheap
                oNewItem.parents('tr').addClass('cheap');
            } else {
                //mark as not cheap
                oNewItem.parents('tr').addClass('not-cheap');
            }
        }

    }

    // when the listings table gets new elements, highlight them
    jQuery('#marketListingView table.marketListings')[0].addEventListener("DOMNodeInserted", markListings);
})();
