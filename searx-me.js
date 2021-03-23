// TODO: rewrite

window.onload = function setFocus(){
//    document.getElementById("loadbox").setAttribute('style','opacity:0;pointer-events: none;')
    document.getElementById("input").focus();
}

function parseXML(xml_string){
  parser = new DOMParser();
  xmlDoc = parser.parseFromString(xml_string, "text/xml");
  return xmlDoc
}

function processOneAuthorName(author_name){
  var name_parts = author_name.split(" ");
  name_parts.shift(); // drop the first name (some people have multiple last names)
  while (name_parts.length > 1 & name_parts[0].endsWith(".")){
    name_parts.shift(); // strip initials between first and last name
  }
  return name_parts.join(" ")
}

function getAuthorString(xml_doc){
  var n_authors = xml_doc.querySelectorAll("entry author").length
  if (n_authors > 2){
    var first_author_string = xml_doc.querySelector("author name").textContent.trim();
    var first_author = processOneAuthorName(first_author_string);
    var author_string = first_author + " et al.";
  } else if (n_authors > 1) {
    var first_author_string  = xml_doc.querySelectorAll("author name")[0].textContent.trim();
    var second_author_string = xml_doc.querySelectorAll("author name")[1].textContent.trim();
    var first_author  = processOneAuthorName(first_author_string);
    var second_author = processOneAuthorName(second_author_string);
    var author_string = first_author + " & " + second_author;
  } else {
    var first_author_string = xml_doc.querySelector("author name").textContent.trim();
    var author_string = processOneAuthorName(first_author_string);
  }
  return author_string
}

function cleanTitle(title_string){
  return title_string.replaceAll("\n  ", " ")
}

function formatMetadata(author, updated, title, id, category, url){
  var formatted = "📄 " + author + " (" + updated.split("-")[0] + ") " + title + " (arX⠶" + id + " [" + category + "]) " + url;
  return formatted
}

function parseArXivXML(xml_doc){
  var author_string = getAuthorString(xml_doc);
  var title = cleanTitle(xml_doc.querySelector("entry title").textContent.trim());
  var url = xml_doc.querySelector("entry id").textContent.trim();
  var arx_id = url.split("/").pop()
  var updated = xml_doc.querySelector("entry updated").textContent.trim();
  var category = xml_doc.querySelector("category").getAttribute("term").split(".").join("⠶");
  var formatted = formatMetadata(author_string, updated, title, arx_id, category, url);
  return formatted
}

function listInfo(){
  var search_term = document.getElementById("input").value;
  var api_url = "https://export.arxiv.org/api/query?search_query=all:" + search_term + "&start=0&max_results=1";
  fetch(api_url)
	.then(response => response.text())
	.then(data => document.getElementById("responselist").innerHTML = parseArXivXML(parseXML(data)));
}
