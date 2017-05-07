cookieslist = {
  $grid: false,
  init: function() {
    var _this = this;
    // config
    moment.locale('fr');      // fr
    moment.updateLocale('fr', {
    relativeTime : {
        future: "dans %s",
        past:   "%s",
        s:  "quelques secondes",
        m:  "une minute",
        mm: "%d minutes",
        h:  "une heure",
        hh: "%d heures",
        d:  "un jour",
        dd: "%d jours",
        M:  "un mois",
        MM: "%d mois",
        y:  "un an",
        yy: "%d années"
    }
    });
    Cookies.json = true;
    Cookies.defaults['expires'] = 30;
    Cookies.defaults['path'] = '/';

    // Materialize :
    $('select').material_select();
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();

    $( "#datepicker" ).datepicker({
      inline: true,
      dateFormat: 'yy-mm-dd',
      onSelect: function(value, date) {
            _this.chgdate(value, date);
            $("#datepicker").hide();
          }
    });
    $("#datepicker").hide();
    $("#calendar").click(function(){
      $("#datepicker").toggle();
    });

    this.$grid  = $('.masonry-wall').masonry({
      itemSelector: '.col'
    });

    // Item d'accueil
    if( $.isEmptyObject( Cookies.get() ) ){
      var id = moment().valueOf();
      var data = {'id': id, 'text':'le chargement de la page', 'delay':0}
      this.setCookie(id, data);
    }

    // Affiche
    this.showitems();

    // Form valid:
    $('.action-add').click( function(){_this.addevent();} );
    $('.action-cancel').click( function(){_this.resetform();} );
  },
  showitems: function(){
      // Affiche les items
      var _this = this;

      // $("#itemslist").empty();
      $('#debug').text(document.cookie);
      var cookies = Cookies.get();
      $.each(cookies, function(id, values) {
          _this.renderitem( id, values )
      });
      this.$grid.masonry('layout');

  },
  renderitem: function(id, values, dolayout){
    var _this = this;

    var delay = moment(values['date']).fromNow() ;

    var template  = _this.cardtemplate;
    var data = {'id': id, 'text':values['text'], 'delay':delay}
    var rendered = Mustache.render(template, data);

    $(".masonry-wall").append( rendered );
    $('#'+id+' .action-delete').on("click", function(e){ _this.deleteevent(id);e.stopPropagation();});
    $('#'+id+' .action-reset').on("click", function(e){ _this.resetevent(id);e.stopPropagation();});


    this.$grid.masonry('addItems',  $('#'+id) );
    if(dolayout){
      this.$grid.masonry('layout');
    }
  },
  addevent: function (){
    console.log('ajouter');
    var text = $('#addtext').val();
    var delay = $('#adddelay').val();

    // var startdate = document.getElementById("datepicker").value;
    // startdate = moment(startdate).valueOf();
    var startdate = moment().subtract(delay, 'hours').valueOf();

    var id_timestamp = moment().valueOf();

    var values = {'text':text, 'date':startdate, 'color':'#E1CE4C'}
    this.setCookie(id_timestamp, values)

    this.renderitem( id_timestamp, values, true )

    $('#modal1').modal('close');
    this.resetform();

  },
  resetform: function(){
    $('#addtext').val('');
    $('#adddelay').val();
  },
  deleteevent: function(id){
    console.log('del:'+id);
    Cookies.remove(id);
    this.$grid.masonry('remove',  $('#'+id) );
    this.$grid.masonry('layout');
  },
  resetevent: function(id){
    var cookie = Cookies.get(id);

    cookie['date'] = moment().valueOf();

    this.setCookie(id, cookie)

    var newtext = cookie['text']+' '+moment().fromNow();
    $('#'+id+' .item-text').text(newtext);
    this.$grid.masonry('layout');
  },
  setCookie: function (cname, cvalue, exdays) {
      Cookies.set(cname, cvalue);
  },
  deleteCookie: function(name){
    Cookies.remove(name);
    // document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },
  cardtemplate:
  "<div class='col s12 m4' id='{{id}}'>\
   <div class='card blue-grey'>\
          <div class='card-content white-text'>\
              <span class='delay'>{{delay}}</span>\
              <span class='depuis'>depuis</span>\
              <p class='item-text'>{{text}}</p>\
          </div>\
          <div class='card-action'>\
              <a class='action-reset waves-effect waves-green btn-floating btn-flat'> <i class='material-icons'>restore</i></a>\
              <a class='action-delete waves-effect waves-red btn-floating btn-flat'> <i class='material-icons'>delete</i></a>\
          </div>\
   </div>\
   </div>",

      // <div class='item_actions'> \
      //   <div class='spacer'></div>\
      //   <button type='button' \
      //       class='button-icon'>\
      //     <i class='material-icons' >color_lens</i>\
      //   </button> \
      //   <button  type='button' \
      //       class='button-icon resetbutton'>\
      //     <i class='material-icons' >restore</i>\
      //   </button> \
      //   <button  type='button' \
      //       class='button-icon deletebutton'>\
      //     <i class='material-icons' >delete</i>\
      //   </button> \
      // </div> \

    chgdate: function(date, dateobj){
      var delay = moment.duration( moment().diff( date ) ).asHours();
      var O = $('<option />', {'text':moment(date).fromNow(), 'value':delay });
      $('#delay').append( O );
      O.prop('selected', true) ;
    },
    clicmenu: function(){


    }
} // end dict
$( document ).ready( function(){cookieslist.init()} );
