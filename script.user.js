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
const fiwn_keyword = new RegExp(/(?<=http:\/\/kielipankki-tools.dy.fi\/cgi-bin\/fiwn\/search\?wn=fi&w=)[\w%]+(?=&t=over&sm=Search)/g) // https://greasyfork.org/en/scripts/421673-get-all-links
const base = "https://kielipankki.fi/cgi-bin/fiwn/fiwn.cgi?wn=fi&w=";
const param = "&t=all&ver=&sm=Search";

const baseWIFI = "https://fi.wiktionary.org/wiki/";
// var wifi = true; // used radio tick box instead
// var currentvalue = document.querySelector('input[name="selector"]:checked').value; not like this

// https://stackoverflow.com/questions/8104242/spread-html-in-multiple-lines-javascript

const logic = '<script>function filter_link(link) {  \n \
if (!!link.match(fiwn_keyword)) { \n \
console.log(link.match(fiwn_keyword)); \n \
return true; \n \
} \n \
return false; \n \
} \n \
function query_mod(link, option) { \n \
\n \
return (option ? baseWIFI : base) + link.match(fiwn_keyword) + (option ? "" : param); \n \
\n \
} \n \
function change_query_links() { \n \
for (const url of document.links) {  \n \
if (filter_link(url.href)) { \n \
url.href = query_mod(url.href, document.querySelector("input[name="selector"]:checked").value); \n \
} \n \
} \n \
}</script>';

{/* <form name="ext_submit" id="ext_submit">click terms for search on form / stem with
    <u><label for="FiWN-radio">wordnet (default)</label> 
      <input type="radio" id="FiWN-radio" name="wifi_selector" value="false" onchange="change_query_links()" /> 
      <label for="WIFI-radio">WIFI</label> 
      <input type="radio" id="WIFI-radio" name="wifi_selector" value="true" onchange="change_query_links()"/></u>
  </form> */}

const radio_selector = '<form name="ext_submit" id="ext_submit">click terms for search on form / stem with \
<script>function filter_link(link) {  \n \
if (!!link.match(fiwn_keyword)) { \n \
console.log(link.match(fiwn_keyword)); \n \
return true; \n \
} \n \
return false; \n \
} \n \
function query_mod(link, option) { \n \
\n \
return (option ? baseWIFI : base) + link.match(fiwn_keyword) + (option ? "" : param); \n \
\n \
} \n \
function change_query_links() { \n \
for (const url of document.links) {  \n \
if (filter_link(url.href)) { \n \
url.href = query_mod(url.href, document.querySelector("input[name="selector"]:checked").value); \n \
} \n \
} \n \
} \
</script> \
<u><label for="FiWN-radio">wordnet (default)</label>  \
  <input type="radio" id="FiWN-radio" name="wifi_selector" value="false" checked="checked" onchange="change_query_links()" />  \
  <label for="WIFI-radio">WIFI</label>  \
  <input type="radio" id="WIFI-radio" name="wifi_selector" value="true" onchange="change_query_links()"/></u> \
      </form>';

// function page_remontti() { // You can find new ones on Kielipankki anyway https://www.kielipankki.fi/corpora/finnwordnet/
function option_remontti() {
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

    // write logic
    document.getElementsByTagName("script").innerHTML += logic;
  }
}

function filter_option(div) {
  return (div === 'click terms for wordnet search on form / stem') ? true : false;
}

function filter_link(link) { // https://greasyfork.org/en/scripts/421673-get-all-links
  if (!!link.match(fiwn_keyword)) {
    console.log(link.match(fiwn_keyword));
    return true;
  }
  return false;
}

function query_mod(link, option) {
  // link = base.concat(link.match(fiwn_keyword), param);
  return (option ? baseWIFI : base) + link.match(fiwn_keyword) + (option ? "" : param);

}

function change_query_links() {
  // document.querySelectorAll("a").forEach(url => {
  for (const url of document.links) { // https://developer.mozilla.org/en-US/docs/Web/API/Document/links
    if (filter_link(url.href)) {
      // url.href = query_mod(url.href, (glob) wifi);
      // https://stackoverflow.com/questions/43680464/have-populated-radio-buttons-want-to-use-submit-button-to-print-the-value-out?rq=3
      // https://stackoverflow.com/questions/9618504/how-to-get-the-selected-radio-button-s-value
      url.href = query_mod(url.href, document.querySelector('input[name="wifi_selector"]:checked').value);
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

(function () {
  "use strict";
  // page_remontti(); // change invalid FiWN project link
  option_remontti(); // show whether the links are on wordnet or WIFI
  // change_query_links(); // now part of option_remontti() and in-page HTML
  enter_submit();
})();