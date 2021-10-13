/*
Convert Windows 1252 characters into simpler characters 

Helpers:
https://www.i18nqa.com/debug/table-iso8859-1-vs-windows-1252.html
http://www.javascripter.net/faq/mathsymbols.htm
https://en.wikipedia.org/wiki/Windows-1252
https://www.utf8-chartable.de/unicode-utf8-table.pl?start=8192&number=512&names=-&utf8=dec

https://en.wikipedia.org/wiki/Windows-1252
https://en.wikipedia.org/wiki/UTF-8
*/

const strangeCharacterFilter = function(str) {
  var result = str
    .split("")
    .map(function(o) {
      return o.charCodeAt(0);
    })
    .filter(function(o) {
      return o !== 65533;
    })
    .map(function(o) {
      return String.fromCharCode(o);
    })
    .join("");
  return result;
};

const replaceWordChars = function(text) {
  var s = text;
  // smart single quotes and apostrophe
  s = s.replace(/[\u2018\u2019\u201A\u201B]/g, "'");
  // smart double quotes
  s = s.replace(/[\u201C\u201D\u201E]/g, '"');
  // ellipsis
  s = s.replace(/\u2026/g, "...");
  // dashes
  s = s.replace(/[\u2013\u2014]/g, "-");
  // circumflex
  s = s.replace(/\u02C6/g, "^");
  // open angle bracket
  s = s.replace(/\u2039/g, "<");
  // close angle bracket
  s = s.replace(/\u203A/g, ">");
  // spaces
  s = s.replace(/[\u02DC\u00A0]/g, " ");

  //91 ec 236, left single quote
  //92 ed 237, right single quote

  //single quotes
  s = s.replace(/\u00ec/g, "'");
  s = s.replace(/\u00ed/g, "'");

  s = s.replace(/\xe2\x80\x90/g, "-"); // dashes
  s = s.replace(/\xe2\x80\x91/g, "-"); // dashes
  s = s.replace(/\xe2\x80\x92/g, "-"); // dashes
  s = s.replace(/\xe2\x80\x93/g, "-"); // dashes
  s = s.replace(/\xe2\x80\x94/g, "-"); // dashes
  s = s.replace(/\xe2\x80\x95/g, "-"); // dashes

  s = s.replace(/\xe2\x80\x98/g, "'"); //left single quote
  s = s.replace(/\xe2\x80\x99/g, "'"); //right single quote

  s = s.replace(/\xe2\x80\x9c/g, '"'); //left double quote
  s = s.replace(/\xe2\x80\x9d/g, '"'); //right double quote

  //double quotes
  s = s.replace(/\u00ee/g, '"');
  s = s.replace(/\u00ef/g, '"');

  //another right apos
  s = s.replace(/\u2018/g, "'");
  s = s.replace(/\u2019/g, "'");

  s = s.replace(/\x00FF/, "");

  //isolated 194
  s = s.replace(/\xc2/g, "");

  s = strangeCharacterFilter(s);

  return s;
};

const inspectMSText = function(raw) {
  console.log("inspecting!!");
  var thresh = 128;
  var map = {
    í: "",
  };
  for (var i = 0; i < raw.length; i++) {
    var charCode = raw.charCodeAt(i);
    var char = raw.charAt(i);
    if (charCode > thresh) {
      console.log("raw", raw[i], char, charCode);
    }
  }
};
export { strangeCharacterFilter, replaceWordChars, inspectMSText };
