function getSearchResults() {
   var text = document.getElementById("searchBar").value;

   if (text.length == 0) {
       alert("O campo de busca não foi preenchido.");
   }
   else {
       location = "/searchResult/" + encodeURIComponent(text);
   }
};