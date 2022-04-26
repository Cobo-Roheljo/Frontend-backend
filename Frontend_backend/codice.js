var serverData;
var selfUrl;
//id
var nextID = 500000;

function leggiServer(url){
  selfUrl = url;
  //questa è la chiamata get ajax
  $.get( url, function(msg) {
    serverData = msg;
    tabellaCodice();
  });
  console.log(serverData);
}
//stampa tabella dei dipendenti
function tabellaCodice(){
//salvo in una variabile non reale la query come se fosse un get
var $_GET = {};
//prendo la query dal url
var parts = window.location.search.substr(1).split("&"); 
var rows = '';
  for (var i = 0; i < parts.length; i++) {
      var temp = parts[i].split("=");
      //salvo nel array get una variabile id che contiene id che è stato richiesto 
      $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]); 
  }
  //creo la tabella
  $.each(serverData["_embedded"]["employees"], function(index, value){
      rows = rows + '<tr>';
      rows = rows + '<td>' + value.id + '</td>';
      rows = rows + '<td>' + value.first_name + '</td>';
      rows = rows + '<td>' + value.last_name + '</td>';
      rows = rows + '<td>' + value.gender + '</td>';
      rows = rows + '<td data-id="' + value.id + '">';
      rows = rows + '<button class="btn btn-warning btn-sm modifica-dipendente" data-bs-toggle="modal" data-bs-target="#modifica-dipendente"> Modifica </button>  ';
      rows = rows + '<button class="btn btn-danger btn-sm elimina-dipendente"> Elimina </button>';
      rows = rows + '</td>';
      rows = rows + '</tr>';
  });    
  //viene sostituito il body creato attraverso il tbody dalla tabella
    $("#tbody").html(rows);
  }
$(document).ready(function (){
  leggiServer("http://localhost:8085/index.php");
    //viene aggiunto un dipendente
    $('#aggiungi').on('click', function(element){
      //poter gestire il comportamento di default
        element.preventDefault(); 
        var nome = $("#nome").val();
        var cognome = $("#cognome").val();
        var genere = $("#genere").val();
        var payload = { "first_name": nome, "last_name": cognome, "gender": genere };
        if(nome != "" && cognome != ""){
          //chiamata ajax del post
          $.ajax({
            method: "POST",
            url: "http://localhost:8085/index.php",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(payload)
          })
          .done(function( msg ) {
            alert( 'Item creato con Successo!', 'Success Alert', {timeout: 5000});
          });
          nextID++;
          $("#crea-dipendente").modal('hide');
        }
        else{
          alert("Tutti i campi devono essere riempiti! Riprova...");
        }
    });
    //serve per eliminare i dipendenti
    $("body").on("click", ".elimina-dipendente", function(){
      var id = $(this).parent("td").data("id");
      $.ajax({
        type: "DELETE",
        url: "http://localhost:8085/index.php?id=" + id,
        success: function (data) {
          leggiServer(selfUrl);
        }
      });
    });
    //serve per modificare i dipendenti 
    $("body").on("click", ".modifica-dipendente", function(){
      var id = $(this).parent("td").data("id");
      var genere = $(this).parent("td").prev("td").text();
      var cognome = $(this).parent("td").prev("td").prev("td").text();
      var nome = $(this).parent("td").prev("td").prev("td").prev("td").text();
      $("#nomeMod").val(nome);
      $("#cognomeMod").val(cognome);
      $("#genereMod").val(genere);    
      $("#modify").on("click", function(e){
        e.preventDefault();
        var name = $("#nomeMod").val();
        var surname = $("#cognomeMod").val();
        var sesso = $("#genereMod").val();
        var payload = { "first_name": name, "last_name": surname, "gender": sesso };       
        //nuova chiamata ajax per aggiornare con il put 
        $.ajax({
          type: 'PUT',
          url: "http://localhost:8085/index.php?id=" + id,
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(payload),
          success: function(data) {
            leggiServer(selfUrl);
          }
        });
      //aggiornare i dati nel frontend con la chiamata del get
        $.ajax({
          method: "GET",
          url: "http://localhost:8085/index.php",
          dataType: "json",
          contentType: "application/json"
        })

        $("#modifica-dipendente").modal("hide");
      });
    });
});
function linkFirst(){
  leggiServer(serverData[ "_links"]["first"]["href"]);
  aggiornaPaginazione(serverData["pages"]["number"]);
};
function linkPrev(){
  leggiServer(serverData[ "_links"]["prev"]["href"]);
  aggiornaPaginazione(serverData["pages"]["number"]);
};  
function linkLast(){
  leggiServer(serverData[ "_links"]["last"]["href"]);
  aggiornaPaginazione(serverData["pages"]["number"]);
};
function linkSelf(){
  leggiServer(serverData[ "_links"]["self"]["href"]);
  aggiornaPaginazione(serverData["pages"]["number"]);
};
function aggiornaPaginazione(n){
  $("#numPagina").html(n + 1);
  document.getElementById("numPagina").textContent = n + 1;
}
function linkNext(){
  leggiServer(serverData[ "_links"]["next"]["href"]);
  aggiornaPaginazione(serverData["pages"]["number"]);
};


