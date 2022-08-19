function money(string){
  var money  = string+" €";
  return money;
}

//Suchfunction Ajax Kategorien
function search(query){
jQuery.getJSON("/search/suggest.json", {
  "q": query,
  "resources": {
    "type": "product",
    "limit": 4,
    "options": {
      "unavailable_products": "last",
      "fields": "title,product_type,variants.title"
    }
  }
  
}).done(function(response) {
  var productSuggestions = response.resources.results.products;
  createresult(productSuggestions);
});
}


function createresult(product){
  product.forEach(function(item) {
  console.log(item);
  var  img = item.featured_image.url.replace(/.([^.]*)$/, "_small.$1");
  var  title = item.title;
  var price = money(item.price);
  var comprice = money(item.compare_at_price_min);
  var  tags = item.tags;
  var id = item.id;

var counter = "<div class='pcardatc'> <div class='js-qty__wrapper' data-id='"+id+"'> <input type='text' class='js-qty__num' value='1' min='0' pattern='[0-9]*'> <button type='button' class='js-qty__adjust js-qty__adjust--minus' aria-label='Artikelmenge um eins reduzieren'> <svg aria-hidden='true' focusable='false' role='presentation' class='icon icon-minus' viewBox='0 0 20 20'><path fill='#444' d='M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z'></path></svg> <span class='icon__fallback-text' aria-hidden='true'>−</span> </button> <button type='button' class='js-qty__adjust js-qty__adjust--plus' aria-label='Artikelmenge um eins erhöhen'> <svg aria-hidden='true' focusable='false' role='presentation' class='icon icon-plus' viewBox='0 0 20 20'><path fill='#444' d='M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z'></path></svg> <span class='icon__fallback-text' aria-hidden='true'>+</span> </button> </div> </div>";

  var cont =  jQuery('<div>', {
    class: 'resultitem'
}).prepend("<img class='resultimg'  src='"+img+"'>");
   
cont.append("<div class='searchtxt'><span class='searchtitle'>"+title+"</span><div class='prices'><span class='searchcomp'>"+comprice+"</span><span class='searchprice'>"+price+"</span></div></div>");  
cont.append(counter);
cont.appendTo('#searchres');
$('#searchres').css( "display", "block" ).fadeIn( 1000 );
});
}


//CustomSuchleiste
$( ".ttextinput" ).change(function() {
var  tags = $('#cat').val();
var query =$(this).val();
search(query);
});

//HoverAnimation Extrahiert:
function hover(){
//Höhe Saven
  $( ".animateimg" ).each(function() {
var height  = $(this).height();
var h = $(this).parent().parent().children('.pcardhide').prop('scrollHeight');
$(this).attr('data-height',height);
$(this).css('min-height',height-h);
    console.log(height);
});

//HoverAnimation
  $( ".pcard" ).hover(function() {
var h = $(this).children('.pcardhide').prop('scrollHeight');
var imgheight = $(this).find('.animateimg').data('height');
var imgheight2 =  imgheight-h;
  
$(this).find('.animateimg').animate({
    height: imgheight2
  }, 200, function() {
    // Animation complete.
  });
$(this).children('.pcardhide').animate({
    height: h
  }, 200, function() {
    // Animation complete.
  })
},function(){
  $(this).find('.animateimg').animate({
    height: $(this).find('.animateimg').data('height')
  }, 200, function() {
    // Animation complete.
  });
$(this).children('.pcardhide').animate({
    height: 0
  }, 200, function() {
    // Animation complete.
  });
});
}

//Data  Neuladen bei Ajax Reload
  document.addEventListener('collection:reloaded', function() {
    console.log('initajax');
hover();
    
  });

//LanguageSelector
function language(){
if ($(window).width() < 769) {
var div =$('.customlang').children('form');
div.clone;
$('#language').html(div);
}
}


$( document ).ready(function() {
hover();
language();
search();
$( ".ttextinput" ).focus(function() {
});
});