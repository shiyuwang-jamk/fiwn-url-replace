// ==UserScript==
// @name         Remontti: HFST omor demo
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Update the links to FiWN demo to the current one; option to use fi.wiktionary.org instead
// @author       shiyuwang
// @match        https://kielipankki.fi/cgi-bin/omor/omordemo.bash*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

// const fiwn_regex = new RegExp(/^http:\/\/kielipankki-tools.dy.fi\/cgi-bin\/fiwn/g);
// v0.2.1: ä, ö escaped, should use % sign
const fiwn_keyword = new RegExp(/(?<=http:\/\/kielipankki-tools.dy.fi\/cgi-bin\/fiwn\/search\?wn=fi&w=)[\w%]+(?=&t=over&sm=Search)/g); // https://greasyfork.org/en/scripts/421673-get-all-links
const base = "https://kielipankki.fi/cgi-bin/fiwn/fiwn.cgi?wn=fi&w=";
const fiwn = new RegExp(/(?<=http:\/\/kielipankki.fi\/cgi-bin\/fiwn\/fiwn\.cgi\?wn=fi&w=)[\w%]+/g);
const param = "&t=all&ver=&sm=Search";

const baseWIFI = "https://fi.wiktionary.org/wiki/";
const WIFIregex = new RegExp(/(?<=http:\/\/fi.wiktionary.org\/wiki\/)[\w%]+/g);
// var wifi = true; // used radio tick box instead
// var currentvalue = document.querySelector('input[name="selector"]:checked').value; not like this

// Changed to linkElement to avoid ambiguity with its href
function filter_link(linkElement, clicked) { // https://greasyfork.org/en/scripts/421673-get-all-links
  if ((!clicked && linkElement.href.match(fiwn_keyword)) || (clicked && linkElement.classList.contains("keywords"))) { // for modified URL
    console.log(linkElement.href.match(fiwn_keyword));
    console.log(true);
    return true;
  }
  return false;
}

// function query_mod(link, option) {
function query_mod(link, option, clicked) {
  // link = base.concat(link.match(fiwn_keyword), param);
  // return (option ? base : baseWIFI) + link.match(fiwn_keyword) + (option ? param : ""); // the default is true, which somehow does not concern the checked box
  return (option ? base : baseWIFI) + link.match(clicked ? (option ? fiwn : WIFIregex) : fiwn_keyword) + (option ? param : ""); // new keyword extraction v0.3

}

function change_query_links(clicked) {
  // document.querySelectorAll("a").forEach(url => {
  for (const url of document.links) { // https://developer.mozilla.org/en-US/docs/Web/API/Document/links
    // if (filter_link(url.href)) {
    if (filter_link(url, clicked)) { // for class, v0.3
      // url.href = query_mod(url.href, (glob) wifi);
      // https://stackoverflow.com/questions/43680464/have-populated-radio-buttons-want-to-use-submit-button-to-print-the-value-out?rq=3
      // https://stackoverflow.com/questions/9618504/how-to-get-the-selected-radio-button-s-value
      url.href = query_mod(url.href, document.querySelector('input[name="selector"]:checked').value, clicked);

      if (!url.classList.contains("keywords")) { // v0.3
        // https://stackoverflow.com/questions/507138/how-to-add-a-class-to-a-given-element
        url.classList.add("keywords"); // Because the original URL was no more
        // url.className += "keywords"; // Compatibility?
      }
    }
  }
}

// Why keep the enter input if the server cannot handle
function enter_submit() {
  document.getElementById("wf").addEventListener("keypress", e => { // https://stackoverflow.com/questions/8934088/how-to-make-enter-key-in-a-textarea-submit-a-form
    if (e.key === "Enter" && !e.shiftkey) {
      e.preventDefault();

      // https://stackoverflow.com/questions/38323750/jquery-find-equivalent-for-javascript
      // https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
      e.currentTarget.closest("fieldset").querySelectorAll("input")[0].click();
    }
  });
}

function filter_option(div) {
  return (div === 'click terms for wordnet search on form / stem') ? true : false;
}

// remontti in Finnish = Renovation
// function page_remontti() { // One can find new ones on Kielipankki anyway https://www.kielipankki.fi/corpora/finnwordnet/
function option_remontti() {

  // why bother with submit if we are to use event listener instead
  // const radio_selector = '<form>click terms for search on form / stem with \
  // https://stackoverflow.com/questions/8104242/spread-html-in-multiple-lines-javascript
  // Default variable value is true, hence renamed to selector 
  const radio_selector = '<form name="ext_submit" id="ext_submit" action="javascript:change_query_links(true)">click terms for search on form / stem with \
          <u><label for="FiWN-radio">wordnet (default)</label>  \
          <input type="radio" id="FiWN-radio" name="selector" value="true" checked="checked" onchange="this.form.submit()" />  \
          <label for="WIFI-radio">WIFI</label>  \
          <input type="radio" id="WIFI-radio" name="selector" value="false" onchange="this.form.submit()"/></u> \
          </form>'; {
    /* <form name="ext_submit" id="ext_submit">click terms for search on form / stem with
        <u><label for="FiWN-radio">wordnet (default)</label> 
          <input type="radio" id="FiWN-radio" name="selector" value="true" onchange="change_query_links()" /> 
          <label for="WIFI-radio">WIFI</label> 
          <input type="radio" id="WIFI-radio" name="selector" value="false" onchange="change_query_links()"/></u>
      </form> */
  }
  // document.querySelectorAll("a").forEach(url => {
  // for (const paragraph of document.querySelectorAll('p')) { // https://developer.mozilla.org/en-US/docs/Web/API/Document/links
  // for (const paragraph of document.querySelectorAll('div')) { // https://developer.mozilla.org/en-US/docs/Web/API/Document/links
  if (filter_option(document.querySelectorAll('div')[0].innerHTML)) {
    // document.querySelectorAll('div')[0].innerHTML = query_mod(url.href);
    // } else if (filter_option(paragraph.innerText)) {
    //   paragraph.innerHTML =
    // }
    // https://stackoverflow.com/questions/843680/how-to-replace-dom-element-in-place-using-javascript
    document.querySelectorAll('div')[0].innerHTML = radio_selector; //replace...

    // write logic?
    // document.getElementsByTagName("script").innerHTML += logic;
  }
}

(function () {
  "use strict";
  // page_remontti(); // change invalid FiWN project link
  option_remontti(); // show whether the links are on wordnet or WIFI
  change_query_links(false); // default option
  enter_submit();

  // regex yields null if added
  // let radios = document.querySelectorAll('input[type="radio"]');
  // radios.forEach(btn => {
  //   // https://stackoverflow.com/questions/14544104/checkbox-check-event-listener
  //   // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
  //   btn.addEventListener('change', change_query_links(true), false); // true? how to define change?
  //   // btn.addEventListener('change', e => {
  //   //   // Error if adding functions here
  //   //   change_query_links(); // still not defined
  //   // })
  // });
})();