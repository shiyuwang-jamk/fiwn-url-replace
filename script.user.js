// ==UserScript==
// @name         Finnish Wikidictionary from HFST omor demo
// @namespace    http://tampermonkey.net/
// @version      WIFI
// @description  Replace invalid FinnWordNet query link in the demo with Finnish Wikidictionary.
// @author       shiyuwang
// @match        https://kielipankki.fi/cgi-bin/omor/omordemo.bash*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

const fiwn_keyword = new RegExp(/(?<=http:\/\/kielipankki-tools.dy.fi\/cgi-bin\/fiwn\/search\?wn=fi&w=)[\w%]+(?=&t=over&sm=Search)/g) // https://greasyfork.org/en/scripts/421673-get-all-links
const base = "https://fi.wiktionary.org/wiki/";

function filter_link(link) { // https://greasyfork.org/en/scripts/421673-get-all-links
  if (!!link.match(fiwn_keyword)) {
    console.log(link.match(fiwn_keyword));
    return true;
  }
  return false;
}

function fiwn_mod(link) {
    return base + link.match(fiwn_keyword);
}

function filter_option(div) {
  return (div === 'click terms for wordnet search on form / stem') ? true : false;
}

function change_links() {
  // document.querySelectorAll("a").forEach(url => {
  for (const url of document.links) { // https://developer.mozilla.org/en-US/docs/Web/API/Document/links
        if (filter_link(url.href)) {
            url.href = fiwn_mod(url.href);
        }
  }

  if (filter_option(document.querySelectorAll('div')[0].innerHTML)) {
    // document.querySelectorAll('div')[0].innerHTML = query_mod(url.href);
    // } else if (filter_option(paragraph.innerText)) {
    //   paragraph.innerHTML =
    // }
    // https://stackoverflow.com/questions/843680/how-to-replace-dom-element-in-place-using-javascript
    document.querySelectorAll('div')[0].innerHTML = "click terms for <b>Finnish Wikidictionary</b> search on form / stem"; //replace...

    // write logic?
    // document.getElementsByTagName("script").innerHTML += logic;
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
  enter_submit();
})();