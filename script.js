// ==UserScript==
// @name         New FinnWordNet from HFST omor demo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       shiyuwang
// @match        https://kielipankki.fi/cgi-bin/omor/omordemo.bash*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

// const fiwn_regex = new RegExp(/^http:\/\/kielipankki-tools.dy.fi\/cgi-bin\/fiwn/g);

const fiwn_keyword = new RegExp(/(?<=http:\/\/kielipankki-tools.dy.fi\/cgi-bin\/fiwn\/search\?wn=fi&w=)[\wöä]+(?=&t=over&sm=Search)/g) // https://greasyfork.org/en/scripts/421673-get-all-links
const base = "https://kielipankki.fi/cgi-bin/fiwn/fiwn.cgi?wn=fi&w=";
const param = "&t=all&ver=&sm=Search";

function filter_link(link) { // https://greasyfork.org/en/scripts/421673-get-all-links
  if (!!link.match(fiwn_keyword)) {
    console.log(link.match(fiwn_keyword));
    return true;
  }
  return false;
}

function fiwn_mod(link) {
    // link = base.concat(link.match(fiwn_keyword), param);
    return link = base + link.match(fiwn_keyword) + param;
    // link.href = link.href.replace( "http://kielipankki-tools.dy.fi", "https://kielipankki.fi" ).replace("search?wn=fi&w=", "fiwn.cgi?wn=fi&w=").replace("&t=over&sm=Search", "&t=all&ver=&sm=Search");

}

function change_links() {
  // document.querySelectorAll("a").forEach(url => {
  for (const url of document.links) { // https://developer.mozilla.org/en-US/docs/Web/API/Document/links
        if (filter_link(url.href)) {
            url.href = fiwn_mod(url.href);
        }
  }
}

// Why keep the enter input if the server cannot handle
function enter_submit() {
  document.getElementById("wf").addEventListener("keypress", e => { // https://stackoverflow.com/questions/8934088/how-to-make-enter-key-in-a-textarea-submit-a-form
    if (e.key === "Enter" && ! e.shiftkey) {
      e.preventDefault();

      // https://stackoverflow.com/questions/38323750/jquery-find-equivalent-for-javascript
      // https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
      e.currentTarget.closest("fieldset").querySelectorAll("input")[0].click();
    }
  } )
}

(function () {
  "use strict";
  change_links();
})();