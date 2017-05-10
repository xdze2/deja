cookieslist = {
  $grid: false,
  p: function(){console.log('open')},
  pickdateoption: {
      today: false,
      clear: false,
      close: 'Ok',
      closeOnSelect: true,
      format: 'yyyy-mm-dd',
      onClose: function(){ cookieslist.chgdate() }, //???,
      onOpen: function(){ return this.p },
      firstDay: 'monday',
      containerHidden:true
  },

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

    $('.datepicker').pickadate(_this.pickdateoption);
    //$('.picker').appendTo('body');


    this.$grid  = $('.masonry-wall').masonry({
      itemSelector: '.col'
    });

    // Item d'accueil
    if( $.isEmptyObject( Cookies.get() ) ){
      var id = moment().valueOf();
      var data = {'id': id, 'text':'le chargement de la page', 'date':id, 'color':'purple lighten-1'}
      this.setCookie(id, data);
    }

    // Affiche
    this.showitems();

    // actions du Formualire Add :
    $('.action-add').click( function(){_this.addevent();} );
    $('.action-cancel').click( function(){_this.resetform();} );

    // Mise à jour automatique
    setInterval(function(){_this.updateauto();}, 100*1000);
  },
  showitems: function(){
      // Affiche les items
      var _this = this;

      var cookies = Cookies.get();
      console.log( cookies );

      $.each(cookies, function(id, values) {
          _this.renderitem( id, values )
      });
      this.$grid.masonry('layout');

  },
  renderitem: function(id, values, dolayout){
    var _this = this;

    var delay = moment(values['date']).fromNow() ;

    var template  = _this.cardtemplate;
    var values = {'id': id, 'text':values['text'], 'delay':delay, 'color':values['color']}
    var rendered = Mustache.render(template, values);

    $(".masonry-wall").append( rendered );
    $('#'+id+' .action-delete').on("click", function(e){ _this.deleteevent(id);e.stopPropagation();});
    $('#'+id+' .action-reset').on("click", function(e){ _this.resetevent(id);e.stopPropagation();});

    this.$grid.masonry('addItems',  $('#'+id) );
    if(dolayout){
      this.$grid.masonry('layout');
    }
  },
  addevent: function (){
    var text = $('#addtext').val();
    var color = $("#colorpicker input[type='radio']:checked").val();

    var delay = $('#adddelay').val();
    var startdate = moment().subtract(delay, 'hours').valueOf();

    var id_timestamp = String( moment().valueOf() );

    var data = {'text':text, 'date':startdate, 'color':color}
    this.setCookie(id_timestamp, data)

    this.renderitem( id_timestamp, data, true )

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
    // Mise à zéro de la date
    var cookie = Cookies.get(String(id));

    cookie['date'] = moment().valueOf();
    var delay = moment(cookie['date']).fromNow() ;

    $('#'+id+' .delay').text(delay);
    this.$grid.masonry('layout');

    this.setCookie(id, cookie)
  },
  updateauto: function(){
    console.log('update');
    var cookies = Cookies.get();

    $.each(cookies, function(id, values) {
        var delay = moment(values['date']).fromNow();
        $('#'+id+' .delay').text(delay);
    });
    this.$grid.masonry('layout');
  },
  setCookie: function (cname, cvalue, exdays) {
      Cookies.set(cname, cvalue);
  },
  deleteCookie: function(name){
    Cookies.remove(name);
  },
  cardtemplate:
  "<div class='col s12 m6 l4' id='{{id}}'>\
   <div class='card {{color}}'>\
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

  chgdate: function(){ //date, dateobj
    console.log('chg date')
    //console.log( $('.datepicker').get() )

    var date = $('.datepicker').val();

    var delay = moment.duration( moment().diff( date ) ).asHours();
    console.log( delay )
    // ajoute ce delais comme option
    // moment(date).fromNow()
    var Opt = $('<option />', {'text':moment(date).fromNow(), 'value':delay });
    $('#adddelay').append( Opt );
    Opt.prop('selected', true) ;
    $('#adddelay').material_select(); //updating
  },
  clicmenu: function(){


  }
} // end dict

$( document ).ready( function(){cookieslist.init()} );
