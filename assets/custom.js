$(window).on("load", function() {
  if ($(window).width() > 768){
   //hover(); 
  }else{
    cardmob();
    savepcard();
    stickyheader();
  }
});

document.addEventListener('cart:updated', function(evt) {
  freeshipping();
 console.log('resetcartimg');
  cartimages();
if ($(window).width() > 768){
  cartmobile();
}
});

function freeshipping(){
var cartlimit = ($('body').data('freeshipping'));


  jQuery.getJSON('/cart.js', function(cart) {
    console.log(cart);
var current = parseFloat(cart.total_price/100);
var money = cartlimit - current;
var money2 = money.toFixed(2);
  if (money2 < 0){
    var money2 = 0;
    $('[data-cartship] span').text('Hurra! Du bekommst kostenlosen Versand!');
    return;
  }
var money2 = money2+' €';
$('.counter').text(cart.item_count)
$('[data-freeshippingamount]').text(money2);

} );
}

document.addEventListener('drawerOpen', function(evt) {
  freeshipping();
 console.log('resetcartimg');
  cartimages();
if ($(window).width() < 768){
  cartmobile();
}
});

function cartimages(){
          $(".pimage img").each(function() {
      var width = $(this).width();
      $(this).css('max-height',width);
          
       if ($(this).hasClass('animateimg2') == true){
            var width = $(this).prop('scrollWidth');

      $(this).css('max-height',width);
          }  
        var h = $(this).parent().parent().children('.pcardhide').prop('scrollHeight');
        //$(this).css('min-height', height - h);
        //custconsole.log(height);
    });
}


function stickyheader(){
var that = $('#stickyy');
var top = that.offset().top;

that.attr('data-scrolltop', top);

$(window).scroll(function(){
var data = $(that).data('scrolltop');
var current = $(document).scrollTop();
if ((data-current) > 0 ){
  $(that).removeClass('stickyy');
}
else{
  $(that).addClass('stickyy');
}
});


var that2 = $('#mobilewrapper');
var top2 = that2.offset().top;

if ($('#mobilewrapper').length){
that2.attr('data-scrolltop', top);
}

$(window).scroll(function(){
var data2 = $(that2).data('scrolltop');
var current2 = $(document).scrollTop();
if ((data2-current2) > 0 ){
  $(that2).removeClass('wrappersticked');
}
else{
  $(that2).addClass('wrappersticked');
}
});

  
}

function money(string) {
    var money = string + " €";
    return money;
}

function closemodal(){
  $('.modalbg').hide();
  $('.modalbg').empty();
}
//ajax request atc
function callproduct(pid,amount,that){
    data = {
      "id": pid,
      "quantity": amount
    }
    
    jQuery.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: data,
      dataType: 'json'
    }).done(
    function(response) {
  
document.dispatchEvent(new CustomEvent('cart:build'));
      var cart = new theme.CartDrawer
cart.open();
document.dispatchEvent(new CustomEvent('cart:build'));
console.log(that);
  $(that).removeClass('btn--loading');    
    }).fail(function(response) {
      //var response2 = JSON.parse(response.responseJSON);
      $(that).removeClass('btn--loading');
      $(that).css('background','#D82C0D');
      $(that).empty(response.responseJSON.description);
      $(that).html(response.responseJSON.description);
      console.log(response.responseJSON.description);
  });


}

//Suchfunction Ajax Kategorien
function searchSet(){
$(".ttextinput").keyup(function() {
  console.log('TEST')
    var tags = $('#cat').val();
    var query = $(this).val();
    search(query);
});
}

function search(query) {
  //console.log('search activated');
    jQuery.getJSON("/search/suggest.json", {
        "q": query,
        "resources": {
            "type": "product",
            "limit": 4,
            "options": {
                "unavailable_products": "hide",
                "fields": "title,product_type,variants.title"
            }
        }

    }).done(function(response) {
      var productSuggestions = response.resources.results.products;

      if (productSuggestions.length == 0 ){
        console.log('Suche leer');
          $('#searchres').text('Keine Ergebnisse. Versuche es mit einem anderem Suchbegriff.');
          $('#PredictiveResults').text('Keine Ergebnisse. Versuche es mit einem anderem Suchbegriff.');
      return
      }
      createresult(productSuggestions);
      increase();
      atc();
      //console.log(response)
    });
}

function creatediv(item){
          console.log(item);
        var img = item.featured_image.url.replace(/.([^.]*)$/, "_small.$1");
        var title = item.title;
        var price = money(item.price);
  var handle= item.handle;
  console.log(handle);
      var url = item.url;
        var comprice = money(item.compare_at_price_min);
      console.log(item.tags);
      if (parseInt(comprice) == 0){
        var comprice ="";
      }
        var tags = item.tags;
        var id = item.id;

  if ($(window).width > 768){
        var counter = "<div class='pcardatc'> <div class='js-qty__wrapper cstmqty' data-handle='" + handle + "' data-id='" + id + "'> <input type='text' class='js-qty__num' value='1' min='0' pattern='[0-9]*'> <button type='button' class='js-qty__adjust js-qty__adjust--minus' aria-label='Artikelmenge um eins reduzieren'> <svg aria-hidden='true' focusable='false' role='presentation' class='icon icon-minus' viewBox='0 0 20 20'><path fill='#444' d='M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z'></path></svg> <span class='icon__fallback-text' aria-hidden='true'>−</span> </button> <button type='button' class='js-qty__adjust js-qty__adjust--plus' aria-label='Artikelmenge um eins erhöhen'> <svg aria-hidden='true' focusable='false' role='presentation' class='icon icon-plus' viewBox='0 0 20 20'><path fill='#444' d='M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z'></path></svg> <span class='icon__fallback-text' aria-hidden='true'>+</span> </button> </div><div class='cstmbtn' data-atcsearch>✓</div> </div>";
  }
  else{
    var counter = "<div class='pcardatc'> <div class='js-qty__wrapper fallbackqty' data-handle='" + handle + "' data-id='" + id + "'> <input type='text' class='js-qty__num' value='1' min='0' pattern='[0-9]*'> <button type='button' class='js-qty__adjust js-qty__adjust--minus' aria-label='Artikelmenge um eins reduzieren'> <svg aria-hidden='true' focusable='false' role='presentation' class='icon icon-minus' viewBox='0 0 20 20'><path fill='#444' d='M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z'></path></svg> <span class='icon__fallback-text' aria-hidden='true'>−</span> </button> <button type='button' class='js-qty__adjust js-qty__adjust--plus' aria-label='Artikelmenge um eins erhöhen'> <svg aria-hidden='true' focusable='false' role='presentation' class='icon icon-plus' viewBox='0 0 20 20'><path fill='#444' d='M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z'></path></svg> <span class='icon__fallback-text' aria-hidden='true'>+</span> </button> </div><div class='cstmbtn' data-atcsearch>✓</div> </div>";
  }
        var cont = jQuery('<div>', {
            class: 'resultitem'
        }).prepend("<img class='resultimg'  src='" + img + "'>");

        cont.append("<div class='searchtxt'><a href='"+item.url+"' class='searchtitle'>" + title + "</a><div class='prices'><span class='searchcomp'>" + comprice + "</span><span class='searchprice'>" + price + "</span></div></div>");
        cont.append(counter);
        

      cont.appendTo('#PredictiveResults');
  cont.clone().appendTo('#searchres');
        $('#searchres').css("display", "block").fadeIn(1000);
      
}

function filtereddiv(count,item,arr){
  console.log(count + "TET");    
  console.log(count);  
  if (count == 0){
    
          $('#searchres').empty();
          $('#searchres').text('Keine Suchergebnisse gefunden.');
          //$('#PredictiveResults').empty();
          console.log('KEINE ERGEBNISSE DIV');
          $('#PredictiveResults').text('Keine Suchergebnisse gefunden.');
            $('#searchres').css("display", "block").fadeIn(1000);
        }
  else{
    $('#searchres').empty();
    //$('#PredictiveResults').empty();
    console.log(arr);
    arr.forEach(function(item) {
    console.log('fiktereddiv');
        var img = item.featured_image.url.replace(/.([^.]*)$/, "_small.$1");
        var title = item.title;
        var price = money(item.price);
      var url = item.url;
        var comprice = money(item.compare_at_price_min);
      //console.log(item.tags);
      if (parseInt(comprice) == 0){
        var comprice ="";
      }
        var tags = item.tags;
        var id = item.id;
      
        var counter = "<div class='pcardatc'> <div class='js-qty__wrapper cstmqty' data-id='" + id + "'> <input type='text' class='js-qty__num' value='1' min='0' pattern='[0-9]*'> <button type='button' class='js-qty__adjust js-qty__adjust--minus' aria-label='Artikelmenge um eins reduzieren'> <svg aria-hidden='true' focusable='false' role='presentation' class='icon icon-minus' viewBox='0 0 20 20'><path fill='#444' d='M17.543 11.029H2.1A1.032 1.032 0 0 1 1.071 10c0-.566.463-1.029 1.029-1.029h15.443c.566 0 1.029.463 1.029 1.029 0 .566-.463 1.029-1.029 1.029z'></path></svg> <span class='icon__fallback-text' aria-hidden='true'>−</span> </button> <button type='button' class='js-qty__adjust js-qty__adjust--plus' aria-label='Artikelmenge um eins erhöhen'> <svg aria-hidden='true' focusable='false' role='presentation' class='icon icon-plus' viewBox='0 0 20 20'><path fill='#444' d='M17.409 8.929h-6.695V2.258c0-.566-.506-1.029-1.071-1.029s-1.071.463-1.071 1.029v6.671H1.967C1.401 8.929.938 9.435.938 10s.463 1.071 1.029 1.071h6.605V17.7c0 .566.506 1.029 1.071 1.029s1.071-.463 1.071-1.029v-6.629h6.695c.566 0 1.029-.506 1.029-1.071s-.463-1.071-1.029-1.071z'></path></svg> <span class='icon__fallback-text' aria-hidden='true'>+</span> </button> </div><div class='cstmbtn' data-atcsearch>✓</div> </div>";
      var cont = jQuery('<div>', {
            class: 'resultitem'
        }).prepend("<img class='resultimg'  src='" + img + "'>");
        cont.append("<div class='searchtxt'><a href='"+item.url+"' class='searchtitle'>" + title + "</a><div class='prices'><span class='searchcomp'>" + comprice + "</span><span class='searchprice'>" + price + "</span></div></div>");
        cont.append(counter);
        cont.appendTo('#searchres');
        //cont.appendTo('#PredictiveResults');
        $('#searchres').css("display", "block").fadeIn(1000);
    });
    }
}

function createresult(product) {


  var filter = $('#cat').val();
  console.log(filter);
  $('#searchres').empty();
  $('#PredictiveResults').empty();
  var filtered=[];



  var count = 0;

    product.forEach(function(item) {
      if (filter !== 'all'){
        console.log(item);
        if (item.tags.includes(filter)){
        filtered.push(item);
          console.log(filtered);
      count++;
        }
      console.log(count);
      filtereddiv(count,item,filtered);
      }
      else{
        creatediv(item);
      }

      
    });
}


//CustomSuchleiste


$(".ttextinput").focusout(function() {

});

$('.faq-title').on("click", function(e) {


var sib = $(this).siblings('.faq-content');
sib.slideToggle('slow');
$(this).find('svg').toggleClass('rot');
});

$(document).on("click", function(e) {
     if ($(e.target).closest("#searchres").length === 0) {
        $("#searchres").hide();
    }
});

function loadimgheights(){
      $(".animateimg").each(function() {

        console.log(height);
    });
      $(".animateimg2").each(function() {
        var height = $(this).height();
        var h = $(this).parent().parent().children('.pcardhide').prop('scrollHeight');
        $(this).attr('data-height', height);
        $(this).css('min-height', height - h);
        console.log(height);
    });
}




//HoverAnimation Extrahiert:
function hover() {
    //HoverAnimation
    $(".pcard").hover(function() {
      var card = $(this);

      if (card.attr('aria-expanded') == 'true'){
        return
      }
      $(this).attr('aria-expanded', true);
      
      var maxheight = $(this).outerHeight();
      card.css('height', maxheight);
      card.phide = card.children('.pcardhide');
      card.pholder = card.children('.pholder');

      var height = card.children('.pcardhide').prop('scrollHeight');
      var pholderHeight = card.pholder.prop('scrollHeight') - height;
      

      $(card.phide).animate({
        height: height
      }, 200 );

      $(card.pholder).animate({
        height: pholderHeight
      }, 200 );

    }, function() {
      var card = $(this);
      card.phide = card.children('.pcardhide');
      card.pholder = card.children('.pholder');

      $(card.pholder).animate({
        height: '100%'
      }, 200 );

      $(card.phide).animate({
        height: 0
      }, 200 );

      $(this).attr('aria-expanded', false);

    });
}

//Data  Neuladen bei Ajax Reload
document.addEventListener('collection:reloaded', function() {
    console.log('initajax');
  if ($(window).width() > 768){
   hover(); 
  }else{
    cardmob();
  }

});

function initajax(){
    if ($(window).width() > 768){
   hover(); 
  }else{
    cardmob();
  }
  //priceFilter();
}

//Custom Quantity Selector

function increase(){ 
$(".cstmqty > button, .fallbackqty > button").on("click", function() {
    if ($(this).parents('#cartdrawer')){
    console.log('noadd');
    //return
  }
  console.log($(this).parent().attr('data-hidden'));
  
  if($(this).parent().attr('data-hidden') == 'false'){
var field = $(this).siblings('input');
var current = parseInt(field.val());
console.log(current);
if ($(this).hasClass('js-qty__adjust--plus')){
  var newval = current + 1;
 field.val(newval);
}else{
var newval = current - 1;
if (newval < 1){
var newval = 1; 
}
 field.val(newval); 
  console.log(newval);
}
  
  }else{
var field = $(this).siblings('input');
var current = parseInt(field.val());
console.log(current);
if ($(this).hasClass('js-qty__adjust--plus')){
  var newval = current + 1;
 field.val(newval);
}else{
var newval = current - 1;
if (newval < 1){
var newval = 1; 
}
 field.val(newval); 
}    
  }
//navigator.vibrate(20);
checkrecprices();
});
}
//Custom Add to cart
function atc(){
$("[data-atc]").on("click", function() {
var pid = $(this).attr('data-atc');
var amount = $(this).parent().parent().find('input').val();
 callproduct(pid,amount);
  });

  $("[data-atcsearch]").on("click", function() {
    $(this).addClass('btn--loading');
var pid = $(this).siblings('.js-qty__wrapper').attr('data-id');
var handle = $(this).siblings('.js-qty__wrapper').attr('data-handle');
var amount = $(this).parent().find('input').val();
    console.log(pid,amount)
//callproduct(pid,amount);
    var that = $(this);
  findProduct(handle,amount,that);
  });


  
}

function findProduct(handle,amount,that){
  jQuery.getJSON(window.Shopify.routes.root + 'products/'+handle+'.js', function(product) {
  console.log(product.variants);
  var found = product.variants.find(x => x.available === true).id;
    //var id =product.variants[0].id;
    console.log(found);
callproduct(found,amount,that)
} );
}


//LanguageSelector
function language() {
    if ($(window).width() < 769) {
        var div = $('.customlang').children('form');
        div.clone;
        $('#language').html(div);
    }
}

//buttons fabren ändern
function checksvg(container, klasse, btncont, jq) {
    var swipecont = container;
    var current = swipecont.scrollLeft();
    console.log(container);
    var w = btncont[0].scrollWidth;
    var w = btncont[0].scrollWidth - btncont.width();
    console.log(btncont);
    console.log(w);
    //btncont.css('background', 'green');
    console.log(current);
    jq.find('rect').attr('fill', '#00573D');
    if (current == 0 || current == w) {

        jq.children("." + klasse + "").children('rect').attr('fill', '#EDEEEF');
    }
}

// Card Slider Homepage
function card() {
  $('.cstmqty').attr('data-hidden','false');
    $(".buttonsholder svg").on("click", function() {
        if ($(window).width() < 768) {
          console.log('slide');
            var that = $(this).parent().parent().siblings('.scrollable');
            var swipecont = that;
            var current = that.scrollLeft();
            var swipe = that.children('.pcard').outerWidth();
            if ($(this).hasClass('left')) {
                swipecont.children('.pcard').css('scroll-snap-align', 'unset');
                swipecont.animate({
                    scrollLeft: current - swipe
                }, 200, function() {
                    swipecont.children('.pcard').css('scroll-snap-align', 'start');
                    checksvg(swipecont, 'left', that, $(this).siblings('.butttons').children('.buttonsholder'));
                });
            } else {
                swipecont.children('.pcard').css('scroll-snap-align', 'unset');
                swipecont.animate({
                    scrollLeft: current + swipe
                }, 200, function() {
                    swipecont.children('.pcard').css('scroll-snap-align', 'start');
                    checksvg(swipecont, 'right', that, $(this).siblings('.butttons').children('.buttonsholder'));
                });
            }
        } else {
            var that = $(this).parent().parent().siblings('.scrollable');
            var swipecont = $(this).parent().parent().siblings('.scrollable');
            var current = swipecont.scrollLeft();
            var swipe = (swipecont.width());
            console.log(current);

            if ($(this).hasClass('left')) {

                swipecont.children('.customslide').css('scroll-snap-align', 'unset');
                swipecont.animate({
                    scrollLeft: current - swipe
                }, 800, function() {
                    swipecont.children('.customslide').css('scroll-snap-align', 'start');
                    checksvg(swipecont, 'left', that, $(this).siblings('.butttons').children('.buttonsholder'));
                });


            } else {
                swipecont.children('.customslide').css('scroll-snap-align', 'unset');
                swipecont.animate({
                    scrollLeft: current + swipe
                }, 800, function() {
                    swipecont.children('.customslide').css('scroll-snap-align', 'start');
                    checksvg(swipecont, 'right', that, $(this).siblings('.butttons').children('.buttonsholder'));
                });
            }
        }
    });
}

//card qty mob
function cardmob(){
 $('.pcard .js-qty__num').val(0);
 
$( ".cstmqty .js-qty__adjust--plus" ).on( "click", function() {


  $(this).attr('data-height', height);
  $(this).css('min-height', height - h);
      var img = $(this).parents('.pcard').find('.animateimg'); //PP
      var height = img.height();
      var width = img.width();
      img.css('max-height',width);
      

      var h = $(this).parent().parent().children('.pcardhide').prop('scrollHeight');

      $(this).attr('data-height', height);

  $(this).parent().attr('data-hidden','false');
  $(this).siblings('.qtyoverlay').find('[data-noborder]').show();
  $(this).parent().css('overflow','hidden');
  $(this).siblings('.qtyoverlay').animate({
    width: 0,
  }, 300, function() {
  var h = $(this).parent().parent().parent().children('.btnholderc').prop('scrollHeight'); //btnholderhide
  var h2  = $(this).parent().parent().parent().prop('scrollHeight') //pcardhide
    console.log($(this).parent().parent().parent());
  var card = $(this).parent().parent().parent().siblings('.pholder');


  card.parent().css('min-height', card.parent().outerHeight());

  var parentheight = card.outerHeight();
    //console.log($(this).parent().parent().parent().prop('scrollHeight'));
  $(this).parent().parent().siblings('.btnholderc').animate({
    height: h
  }, 200, function() {
    // Animation complete.
  });
  $(card).animate({
    height: parentheight-h2
  }, 200, function() {
    // Animation complete.
  });
     
   $(this).remove();
  
  });

});
}

//hover menu
function menu(){
$(".dropdownholder").on({
    mouseenter: function () {
$('.dropdownholder').children('.secul').hide();
$(this).children('.secul').slideToggle('fast');
    },
    mouseleave: function () {
        //stuff to do on mouse leave
    }
});

$(".secul,#searchres").on({
    mouseenter: function () {
$(this).show();
    },
    mouseleave: function () {
$(this).hide();
    }
});
  
}

function accajax(){
var modal = $('.modalbg');
  $( "[data-formatc]" ).on( "click", function(form) {
    $('.modalbg').empty();
  var form = $(this).siblings('.modalform').clone();
  form.show();
  
  form.appendTo(modal);
modal.addClass('bgflex');
    modal.show();
accajax();
  });

  $( "[data-showadd]" ).on( "click", function(form) {
    $('.modalbg').empty();
  var form = $(this).siblings('.modaladd').clone();
  form.show();
  
  form.appendTo(modal);
modal.addClass('bgflex');
    modal.show();
accajax();
  });

$( "[data-addadd]" ).on( "click", function(form) {
  $('.modalbg').empty();
  var form = $('#AddressNewForm').children('.modalform').clone();
 form.append('<a class="modalclose" onclick="closemodal()">X</a>');
  
  form.show();
  
  form.appendTo(modal);
modal.addClass('bgflex');
    modal.show();
accajax();
  });

$( "[data-fkt]" ).on( "click", function() {

var id = $(this).attr('data-form-idfk');
var cid = "EditAddress_"+id;
console.log(cid);

$('[data-form-id="'+id+'"]').click();
  
});

  $( ".template-customers-account .table__section" ).on( "click", function() {
console.log('test');
});
  
  
  }
function init2(){
   accajax(); 
}

document.addEventListener('page:loaded', function() {
initajax();
  if ($(window).width() < 768){
   savepcard();
  }
});


function cartmobile(){
          $(".animateimg2").each(function() {
        var height = $(this).parent().height();
      var width = $(this).parent().width();
      //$(this).css('max-height',width);
        var h = $(this).parent().parent().children('.pcardhide').prop('scrollHeight');
        $(this).attr('data-height', height);
        $(this).css('max-height', width);
        console.log(height);
    });
}



function savepcard(){
        $(".animateimg2").each(function() {
        var height = $(this).height();
      var width = $(this).prop('scrollWidth');
      //$(this).css('max-height',width);
        var h = $(this).parent().parent().children('.pcardhide').prop('scrollHeight');
        $(this).attr('data-height', height);
        //$(this).css('min-height', height - h);
        console.log(height);
    });

        $(".pimage img").each(function() {
          if ($(this).hasClass('animateimg2')){
            console.log($(this).width()+'HIER');
            //$(this).css('max-height', $(this).width());
           return;
          }
      var width = $(this).width();
      //$(this).css('max-height',width);
          
       if ($(this).hasClass('animateimg2') == true){
            var width = $(this).prop('scrollWidth');

      //$(this).css('max-height',width);
          }  
        var h = $(this).parent().parent().children('.pcardhide').prop('scrollHeight');
        //$(this).css('min-height', height - h);
        //custconsole.log(height);
    });

    $('.animateimg').each(function() {
      var w = $(this).width();
      //$(this).css('max-height', w);
    });

          $(".pcard").each(function() {
        var height = $(this).height();
      var scroll = $(this).find('.pcardhide').prop('scrollHeight');
      var del = $(this).find('.qtyoverlay').prop('scrollHeight');
        //$(this).css('min-height', height+scroll-del-10);
        //$(this).css('min-height', height - h);
        
    });
  
}

function open(elem) {
    if (document.createEvent) {
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        elem[0].dispatchEvent(e);
    } else if (element.fireEvent) {
        elem[0].fireEvent("onmousedown");
    }
}

function getTextWidth(txt) {
  var $elm = $('<span class="tempforSize">'+txt+'</span>').prependTo("body");
  var elmWidth = $elm.width();
  $elm.remove();
  return elmWidth;
}
function centerSelect($elm) {
    var optionWidth = getTextWidth($elm.children(":selected").html())
    var emptySpace =   $elm.width()- optionWidth;
    $elm.css("text-indent", (emptySpace/2) - 10);// -10 for some browers to remove the right toggle control width
}

function sortby(){
var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
               navigator.userAgent &&
               navigator.userAgent.indexOf('CriOS') == -1 &&
               navigator.userAgent.indexOf('FxiOS') == -1;
  
  console.log(isSafari);
  if (isSafari == true){
$('#SortBy').each(function(){
  centerSelect($(this));
});
  }
}


function customprice(that){
  var input = $(that).siblings('input').val();
  //console.log($('.variant-wrapper'));

var price = $(that).parent().siblings('[data-price]').attr('data-price');
var price = parseFloat(price);
  
  if($('.variant-wrapper').length > 0){
    var finder = $('.variant-input-wrap input[type=radio]:checked').parent().attr('data-price');
    console.log(finder);
    var price = parseFloat(finder);
  }
  
var gesamt = money((price*input/100).toFixed(2));
$('[data-product-price-c]').text(gesamt);
$('[data-fqty]').find('input').val(input); 
}

function ppage(){
$( ".buyboxform .js-qty__wrapper button").on( "click", function(){
//console.log('clicked');
var input = $(this).siblings('input').val();
  //console.log($('.variant-wrapper'));

var price = $(this).parent().siblings('[data-price]').attr('data-price');
var price = parseFloat(price);
  
  if($('.variant-wrapper').length > 0){
    var finder = $('.variant-input-wrap input[type=radio]:checked').parent().attr('data-price');
    console.log(finder);
    var price = parseFloat(finder);
  }
  
var gesamt = money((price*input/100).toFixed(2));
$('[data-product-price-c]').text(gesamt);
$('[data-fqty]').find('input').val(input); 
});


$( "[data-fkqtc-2]" ).on( "click", function(){
  console.log('atcc');
  $('[data-add-to-cart]').trigger('click');
});


  
$( "[data-rp-button]" ).on( "click", function(){
checkrecprices(true);
});

$( ".rec-p input" ).on( "change", function(){
checkrecprices(false);
});

$( ".rec-p button" ).on( "click", function(){
//checkrecprices();
});

$( ".buyboxitem").on( "click", function(){
$(this).siblings().removeClass('focus');
$(this).addClass('focus');
var qty = $(this).data('qty');
  
var plus = $('[data-fqty]').find('.js-qty__adjust--plus');

  var minus = $('[data-fqty]').find('.js-qty__adjust--minus');
//$('[data-fqty]').parent().parent().show();
var current = parseInt($('[data-fqty]').find('input').val());
  console.log(current);

  var diff = current - qty;
  console.log(diff);
$('.buyboxform').find('input').val(qty);
if (diff < 0){
var diff = Math.abs(diff);
console.log('Kleinergleich'+diff);
for(var i = 0; i < diff; i++) {
  plus.trigger("click");
  //minus.hide();
}
}else{
  for(var i = 0; i < diff; i++) {
  minus.trigger("click");
  //minus.hide();
}
}
var that = $( ".buyboxform .js-qty__wrapper button");
customprice(that); 
});
  
}

function changerp(price){
  $('.rp-gesamt').html(money(price/100));
}

function checkrecprices(add){
var gesamtprice = 0;
var atc = {};
  var ids = [];
  var idatc = {};

  var ajaxarray = [];
$('.rec-buybox').find('.control input:checked').each(function(index){
ids.push($(this).data('id'));
  
  console.log(idatc);
//console.log(add);
});
                                                  
$('.rec-p').children('.product-recommended').each(function(index){
//console.log(gesamtprice);
var id = $(this).data('id');

if (ids.indexOf(id) !== -1){
var pprice = parseFloat($(this).data('price'));
var qty = parseFloat($(this).find('input').val());
idatc[index] = {};

idatc[index]['id'] =  $(this).data('id');
idatc[index]['quantity'] = qty;
  //idatc[id][qty] = qty;
ajaxarray.push(idatc[index]);
var gesamtproduct = pprice*qty;
gesamtprice += +gesamtproduct;
changerp(gesamtprice);
//console.log(gesamtprice+'gesamt');
//console.log(pprice);
}

});

if (add == true){
  console.log('arrayatc');
  console.log(JSON.stringify(ajaxarray));
  addmultiples(ajaxarray);
}
  
}

function addmultiples(data){
var data2 = {
};

data2['items'] = data;

    jQuery.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: data2,
      dataType: 'json'
    });

document.dispatchEvent(new CustomEvent('cart:build'));
      var cart = new theme.CartDrawer
cart.open();
document.dispatchEvent(new CustomEvent('cart:build'));
  
}

$(document).ready(function() {
    //$( "#tabs" ).tabs();
  ppage();
    increase();
  sortby();
    menu();
    atc();
    language();
    search();
    card();
  accajax();
  searchSet();


});