cookieslist = {
  $grid: false,
  init: function() {
    var _this = this;
    // config
    moment.locale('fr');      // fr
    moment.updateLocale('fr', {
    relativeTime : {
        future: "dans %s",
        past:   "depuis %s",
        s:  "seulement quelques secondes",
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

    this.$grid  = $('.grid').masonry({
      itemSelector: '.item',
      //columnWidth: 200,
      fitWidth: true,
      gutter: 8 //margin
    });

    // Affiche
    this.showitems();

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

    $("#itemslist").append( rendered );
    $('#'+id+' .deletebutton').on("click", function(e){ _this.deleteevent(id);e.stopPropagation();});
    $('#'+id+' .resetbutton').on("click", function(e){ _this.resetevent(id);e.stopPropagation();});

    // $('#'+id+' .mdl-card__actions').hide();
    // $('#'+id+' .mdl-card__actions').click(function(event){
    //    $('#'+id+' .mdl-card__actions').slideUp('slow');
    // });
    // $('#'+id+' .mdl-card__supporting-text').click(function(){
    //    $('#'+id+' .mdl-card__actions').slideDown('slow');
    // });


    this.$grid.masonry('addItems',  $('#'+id) );
    if(dolayout){
      this.$grid.masonry('layout');
    }
  },
  addevent: function (){
    var text = document.getElementById("text").value;
    var delay = document.getElementById("delay").value;
    // var startdate = document.getElementById("datepicker").value;
    // startdate = moment(startdate).valueOf();
    var startdate = moment().subtract(delay, 'hours').valueOf();

    var id_timestamp = moment().valueOf();

    var values = {'text':text, 'date':startdate, 'color':'#E1CE4C'}
    this.setCookie(id_timestamp, values)

    this.renderitem( id_timestamp, values, true )

    $('#addform').trigger("reset");
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
    $('#'+id+' .mdl-card__supporting-text').text(newtext);

  },
  setCookie: function (cname, cvalue, exdays) {
      Cookies.set(cname, cvalue);
  },
  deleteCookie: function(name){
    Cookies.remove(name);
    // document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },
  cardtemplate: "<div  id='{{id}}' class='item mdl-card mdl-shadow--2dp'>\
      <div class='mdl-card__supporting-text'>\
        {{text}} {{delay}}.\
      </div> \
      <div class='mdl-card__actions mdl-card--border'> \
        <div class='mdl-layout-spacer'></div>\
        <button  type='button' \
            class='mdl-button mdl-js-button mdl-button--icon'>\
          <i class='material-icons' >color_lens</i>\
        </button> \
        <button  type='button' \
            class='resetbutton mdl-button mdl-js-button mdl-button--icon'>\
          <i class='material-icons' >restore</i>\
        </button> \
        <button  type='button' \
            class='deletebutton mdl-button mdl-js-button mdl-button--icon'>\
          <i class='material-icons' >delete</i>\
        </button> \
      </div> \
    </div>",
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
