function showPassword() {
    
    var key_attr = $('#key').attr('type');
    
    if(key_attr != 'text') {
        
        $('.checkbox').addClass('show');
        $('#key').attr('type', 'text');
        
    } else {
        
        $('.checkbox').removeClass('show');
        $('#key').attr('type', 'password');
        
    }
    
};

$("#check_out").on("change", function() {
    $(this).prop("disabled", false);
  });
  
  $(function() {
    var defaults = {
      closeText: 'Cerrar',
      prevText: '<Anterior',
      nextText: 'Siguiente>',
      currentText: 'Hoy',
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
      weekHeader: 'Sm',
      dateFormat: 'yy/mm/dd',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''
    };
  
    $.datepicker.setDefaults(defaults);
    $("#check_in").datepicker({
      //The value "0" means today (0 days from today)
      minDate: 0,
      onSelect: function(dateStr) {
        //datepicker("setDate", new Date()); //día actual.
        var minDate = $(this).datepicker('getDate');
        if (minDate) {
          var maxDate = $("#check_out").datepicker('getDate');
          if (maxDate && minDate < maxDate) {} else {
            minDate.setDate(minDate.getDate() + 1);
            $('#check_out').datepicker('setDate', minDate).
            datepicker('option', 'minDate', minDate); //día siguiente al actual en "check_out".
          }
        }
        $('#check_out').change();
      }
    });
  
    $('#check_out').datepicker().on("input click", function(e) {
      console.log("Fecha salida cambiada: ", e.target.value);
    });
  });
  
  function calculoNoches() {
    var check_in = document.getElementById("check_in").value;
    var check_out = document.getElementById("check_out").value;
    var f1 = parseDate(check_in);
    var f2 = parseDate(check_out);
    var noches = daydiff(f1, f2);
    //Comprobacion del numero de noches.
    if (noches <= 0) {
      document.getElementById("calculoNoches").innerHTML = "";
    } else {
      //calculoDias()
      document.getElementById("calculoNoches").innerHTML = "Estancia de " + noches + " días.";
      
    }
  }
  


  function parseDate(str) {
    var strDate = str.split('/');
    return new Date(strDate[1], strDate[0] - 1, strDate[2]); // AAAA/MMM/DD
  }
  
  function daydiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24)); // CALCULO EN DIAS
  }

