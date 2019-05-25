var lesson = 6
var number = 0

$(document).scroll(function(){
  $('header').toggleClass('header-shadow', $(this).scrollTop() > 0);
})

$(document).ready(function(){
  var lang = getQueryVariable('lang')
  if (lang != false) setup(lang)
  else setup('en')
})

function setup(language) {
  for (i = 1; i <= 6; i++) {
    $('table').append(
      '<tr><th>' + i + '</th><td id="'
      + i + '1" ondrop="drop(event)" ondragover="allowDrop(event)"></td><td id="'
      + i + '2" ondrop="drop(event)" ondragover="allowDrop(event)"></td><td id="'
      + i + '3" ondrop="drop(event)" ondragover="allowDrop(event)"></td><td id="'
      + i + '4" ondrop="drop(event)" ondragover="allowDrop(event)"></td><td id="'
      + i + '5" ondrop="drop(event)" ondragover="allowDrop(event)"></td></tr>'
    )
  }
  var lang_file = document.createElement('script')
  lang_file.setAttribute('type', 'text/javascript')
  lang_file.setAttribute('src', './js/strings_' + language + '.js')
  document.head.appendChild(lang_file)
  lang_file.onload = function () {
    $('html').attr('lang', language)
    $('meta[name=description]').attr('content', string_description)
    $('#manifest').attr('href', './pwa/manifest_' + language + '.json')
    document.title = string_timetable_software

    $('#timetable').html(string_timetable)

    $('#monday').html(string_monday)
    $('#tuesday').html(string_tuesday)
    $('#wednesday').html(string_wednesday)
    $('#thursday').html(string_thursday)
    $('#friday').html(string_friday)

    $('#subjects').html(string_subjects)
    $('#add_subject').html(string_add_subject)
    $('#add_lesson').html(string_add_lesson)
    $('#drag_and_drop').html(string_drag_and_drop)

    $('#deleting').html(string_deleting)
    $('#empty_trash').html(string_empty_trash)
    $('#delete_all_subjects').html(string_delete_all_subjects)
    $('#delete_all_additional_lessons').html(string_delete_all_additional_lessons)

    $('#editing').html(string_editing)
    $('#change_name').html(string_change_name)
    $('#change_color').html(string_change_color)

    $('#saving_and_loading').html(string_saving_and_loading)
    $('#save').html(string_save)
    $('#load_label').html('<input id="load" type="file" onchange="load()" accept=".json">' + string_load)

    $('#printing').html(string_printing)
    $('#print_timetable').html(string_print_timetable)
    $('#printing_color_warning').html(string_printing_color_warning)

    $('#language').html(string_language)
    $('#english').html(string_english)
    $('#german').html(string_german)

    $('#copyright').html(string_copyright)
    $('#created_with').html(string_created_with)

    $('#dialog_btn_positive').html(string_dialog_btn_positive)
    $('#dialog_btn_negative').html(string_dialog_btn_negative)
    $('#subject_dialog_btn_positive').html(string_dialog_btn_positive)
    $('#subject_dialog_btn_negative').html(string_dialog_btn_negative)
    $('#edit_subject_dialog_btn_positive').html(string_dialog_btn_positive)
    $('#edit_subject_dialog_btn_negative').html(string_dialog_btn_negative)

    $('#subject_dialog_title').html(string_add_subject)
    $('#subject_dialog_name_txt').html(string_enter_subject)
    $('#subject_dialog_name').attr('placeholder', string_default_subject)
    $('#subject_dialog_color_txt').html(string_enter_color)
    $('#subject_dialog_color').attr('placeholder', string_default_color)

    $('#loading_screen').remove()
  }
}

function allowDrop(ev) {
    ev.preventDefault()
}

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id)
}

function drop(ev) {
    ev.preventDefault()
    var data = ev.dataTransfer.getData('text')
    ev.target.appendChild(document.getElementById(data))
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    for (var i=0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if(pair[0] == variable){return pair[1]}
    }
    return(false)
}

function makeDialog(title, text, onPositiveBtn = function() {}, onNegativeBtn = null) {
  $('#dialog_title').html(title)
  $('#dialog_text').html(text)
  $('#dialog_btn_positive').off('click').on('click', function() {
    onPositiveBtn()
    $('#dialog').addClass('invisible')
  })
  if (typeof onNegativeBtn === 'function') {
    $('#dialog_btn_negative').removeClass('invisible')
    $('#dialog_btn_negative').off('click').on('click', function() {
      onNegativeBtn()
      $('#dialog').addClass('invisible')
    })
  } else {
    $('#dialog_btn_negative').addClass('invisible')
  }
  $('#dialog').removeClass('invisible')
}

function makeEditDialog(title, text, placeholder, onPositiveBtn) {
  $('#edit_subject_dialog_title').html(title)
  $('#edit_subject_dialog_text').html(text)
  $('#edit_subject_dialog_input').attr('placeholder', placeholder)
  $('#edit_subject_dialog_btn_positive').off('click').on('click', function() {
    onPositiveBtn()
    $('#edit_subject_dialog').addClass('invisible')
    $('#edit_subject_dialog_input').val('')
  })
  $('#edit_subject_dialog_btn_negative').off('click').on('click', function() {
    $('#edit_subject_dialog').addClass('invisible')
  })
  $('#edit_subject_dialog').removeClass('invisible')
}

function addSubject() {
  $('#subject_dialog_btn_positive').off('click').on('click', function() {
    var subject = $('#subject_dialog_name').val()
    var bgColor = $('#subject_dialog_color').val()
    if (subject === '') subject = string_default_subject
    if (bgColor === '') bgColor = string_default_color
    txtColor = pickTextColor(bgColor, 'white', 'black')
    $('span#new').append(
      '<div id="drag' + number + '" class="subject" draggable="true" ondragstart="drag(event)" style="background:' + bgColor + ';color:' + txtColor + '">' + subject + '</div>'
    )
    number++
    $('#subject_dialog_name').val('')
    $('#subject_dialog_color').val('')
    $('#subject_dialog').addClass('invisible')
  })
  $('#subject_dialog_btn_negative').off('click').on('click', function() {
    $('#subject_dialog').addClass('invisible')
  })
  $('#subject_dialog').removeClass('invisible')
}

function addLesson() {
  lesson++
  $('table').append(
    '<tr class="additional"><th>' + lesson + '</th><td id="'
    + lesson + '1" ondrop="drop(event)" ondragover="allowDrop(event)"></td><td id="'
    + lesson + '2" ondrop="drop(event)" ondragover="allowDrop(event)"></td><td id="'
    + lesson + '3" ondrop="drop(event)" ondragover="allowDrop(event)"></td><td id="'
    + lesson + '4" ondrop="drop(event)" ondragover="allowDrop(event)"></td><td id="'
    + lesson + '5" ondrop="drop(event)" ondragover="allowDrop(event)"></td></tr>'
  )
}

function emptyTrash() {
    makeDialog(string_empty_trash, string_empty_trash_text, function() {
        $('#delete .subject').remove()
    }, function() {})
}

function deleteAllSubjects() {
    makeDialog(string_delete_all_subjects, string_delete_all_subjects_text, function() {
        $('.subject').remove()
    }, function() {})
}

function deleteAllAdditionalLessons() {
    makeDialog(string_delete_all_additional_lessons, string_delete_all_additional_lessons_text, function() {
        $('.additional').remove()
        lesson = 6
      }, function() {})
}

function changeName() {
  if($('#edit .subject').length){
    makeEditDialog(string_change_name, string_enter_new_subject, string_default_subject, function() {
      var subject = $('#edit_subject_dialog_input').val()
      if(subject === '') bgColor = string_default_subject
      $('#edit .subject').html(subject)
    })
  }else{
    makeDialog(string_change_name, string_put_subject_in_editing_area)
  }
}

function changeColor() {
  if($('#edit .subject').length){
    makeEditDialog(string_change_color, string_enter_new_color, string_default_color, function() {
      var bgColor = $('#edit_subject_dialog_input').val()
      if(bgColor === '') bgColor = string_default_color
      txtColor = pickTextColor(bgColor, 'white', 'black')
      $('#edit .subject').css('background',bgColor)
      $('#edit .subject').css('color',txtColor)
    })
  }else{
    makeDialog(string_change_color, string_put_subject_in_editing_area)
  }
}

function setLanguage(language) {
  makeDialog(string_language, string_reload_warning, function() {
      window.location = '?lang=' + language
  }, function() {})
}

function getExtension(filename) {
  var parts = filename.split('.')
  return parts[parts.length - 1]
}

function save() {
  var saveArr = [lesson]
  saveArr[saveArr.length] = number
  for (i = 1; i <= lesson; i++) {
    for (j = 1; j <= 5; j++) {
      saveArr[saveArr.length] = document.getElementById(String(i) + j).innerHTML
    }
  }
  var hiddenElement = document.createElement('a')
  hiddenElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(saveArr))
  hiddenElement.target = '_blank'
  hiddenElement.download = string_default_file_name + '.json'
  hiddenElement.click()
}

function load() {
  var file = document.getElementById('load').files[0]
  var ext = getExtension(document.getElementById('load').value)
  if (file && ext.toLowerCase() == 'json') {
    var reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (evt) {
      var loadArr = JSON.parse(reader.result)
      number = loadArr[1]
      lesson = 6
      $('.additional').remove()
      $('.subject').remove()
      for (i = 0; i < loadArr[0] - 6; i++) {
        addLesson()
      }
      var pos = 2
      for (i = 1; i <= loadArr[0]; i++) {
        for (j = 1; j <= 5; j++) {
          document.getElementById(String(i) + j).innerHTML = loadArr[pos]
          pos++
        }
      }
    }
    reader.onerror = function (evt) {
      document.getElementById('11').innerHTML = evt
    }
  } else if (file && ext.toLowerCase() != 'json')
    makeDialog(string_load, string_file_format_not_supported)
}

function pickTextColor(inputColor, lightColor, darkColor) {
  if (inputColor.charAt(0) === '#' && inputColor.length === 7)
    var color = inputColor.substring(1,7)
  else if (inputColor.charAt(0) === '#' && inputColor.length === 4)
    var color = inputColor[1] + inputColor[1] + inputColor[2] + inputColor[2] + inputColor[3] + inputColor[3]
  else {
    switch (inputColor.toUpperCase()) {
      case 'BLACK': var color = '000000'; break;
      case 'NAVY': var color = '000080'; break;
      case 'DARKBLUE': var color = '00008B'; break;
      case 'MEDIUMBLUE': var color = '0000CD'; break;
      case 'BLUE': var color = '0000FF'; break;
      case 'DARKGREEN': var color = '006400'; break;
      case 'GREEN': var color = '008000'; break;
      case 'TEAL': var color = '008080'; break;
      case 'DARKCYAN': var color = '008B8B'; break;
      case 'DEEPSKYBLUE': var color = '00BFFF'; break;
      case 'DARKTURQUOISE': var color = '00CED1'; break;
      case 'MEDIUMSPRINGGREEN': var color = '00FA9A'; break;
      case 'LIME': var color = '00FF00'; break;
      case 'SPRINGGREEN': var color = '00FF7F'; break;
      case 'AQUA': var color = '00FFFF'; break;
      case 'CYAN': var color = '00FFFF'; break;
      case 'MIDNIGHTBLUE': var color = '191970'; break;
      case 'DODGERBLUE': var color = '1E90FF'; break;
      case 'LIGHTSEAGREEN': var color = '20B2AA'; break;
      case 'FORESTGREEN': var color = '228B22'; break;
      case 'SEAGREEN': var color = '2E8B57'; break;
      case 'DARKSLATEGRAY': var color = '2F4F4F'; break;
      case 'DARKSLATEGREY': var color = '2F4F4F'; break;
      case 'LIMEGREEN': var color = '32CD32'; break;
      case 'MEDIUMSEAGREEN': var color = '3CB371'; break;
      case 'TURQUOISE': var color = '40E0D0'; break;
      case 'ROYALBLUE': var color = '4169E1'; break;
      case 'STEELBLUE': var color = '4682B4'; break;
      case 'DARKSLATEBLUE': var color = '483D8B'; break;
      case 'MEDIUMTURQUOISE': var color = '48D1CC'; break;
      case 'INDIGO ': var color = '4B0082'; break;
      case 'DARKOLIVEGREEN': var color = '556B2F'; break;
      case 'CADETBLUE': var color = '5F9EA0'; break;
      case 'CORNFLOWERBLUE': var color = '6495ED'; break;
      case 'REBECCAPURPLE': var color = '663399'; break;
      case 'MEDIUMAQUAMARINE': var color = '66CDAA'; break;
      case 'DIMGRAY': var color = '696969'; break;
      case 'DIMGREY': var color = '696969'; break;
      case 'SLATEBLUE': var color = '6A5ACD'; break;
      case 'OLIVEDRAB': var color = '6B8E23'; break;
      case 'SLATEGRAY': var color = '708090'; break;
      case 'SLATEGREY': var color = '708090'; break;
      case 'LIGHTSLATEGRAY': var color = '778899'; break;
      case 'LIGHTSLATEGREY': var color = '778899'; break;
      case 'MEDIUMSLATEBLUE': var color = '7B68EE'; break;
      case 'LAWNGREEN': var color = '7CFC00'; break;
      case 'CHARTREUSE': var color = '7FFF00'; break;
      case 'AQUAMARINE': var color = '7FFFD4'; break;
      case 'MAROON': var color = '800000'; break;
      case 'PURPLE': var color = '800080'; break;
      case 'OLIVE': var color = '808000'; break;
      case 'GRAY': var color = '808080'; break;
      case 'GREY': var color = '808080'; break;
      case 'SKYBLUE': var color = '87CEEB'; break;
      case 'LIGHTSKYBLUE': var color = '87CEFA'; break;
      case 'BLUEVIOLET': var color = '8A2BE2'; break;
      case 'DARKRED': var color = '8B0000'; break;
      case 'DARKMAGENTA': var color = '8B008B'; break;
      case 'SADDLEBROWN': var color = '8B4513'; break;
      case 'DARKSEAGREEN': var color = '8FBC8F'; break;
      case 'LIGHTGREEN': var color = '90EE90'; break;
      case 'MEDIUMPURPLE': var color = '9370DB'; break;
      case 'DARKVIOLET': var color = '9400D3'; break;
      case 'PALEGREEN': var color = '98FB98'; break;
      case 'DARKORCHID': var color = '9932CC'; break;
      case 'YELLOWGREEN': var color = '9ACD32'; break;
      case 'SIENNA': var color = 'A0522D'; break;
      case 'BROWN': var color = 'A52A2A'; break;
      case 'DARKGRAY': var color = 'A9A9A9'; break;
      case 'DARKGREY': var color = 'A9A9A9'; break;
      case 'LIGHTBLUE': var color = 'ADD8E6'; break;
      case 'GREENYELLOW': var color = 'ADFF2F'; break;
      case 'PALETURQUOISE': var color = 'AFEEEE'; break;
      case 'LIGHTSTEELBLUE': var color = 'B0C4DE'; break;
      case 'POWDERBLUE': var color = 'B0E0E6'; break;
      case 'FIREBRICK': var color = 'B22222'; break;
      case 'DARKGOLDENROD': var color = 'B8860B'; break;
      case 'MEDIUMORCHID': var color = 'BA55D3'; break;
      case 'ROSYBROWN': var color = 'BC8F8F'; break;
      case 'DARKKHAKI': var color = 'BDB76B'; break;
      case 'SILVER': var color = 'C0C0C0'; break;
      case 'MEDIUMVIOLETRED': var color = 'C71585'; break;
      case 'INDIANRED ': var color = 'CD5C5C'; break;
      case 'PERU': var color = 'CD853F'; break;
      case 'CHOCOLATE': var color = 'D2691E'; break;
      case 'TAN': var color = 'D2B48C'; break;
      case 'LIGHTGRAY': var color = 'D3D3D3'; break;
      case 'LIGHTGREY': var color = 'D3D3D3'; break;
      case 'THISTLE': var color = 'D8BFD8'; break;
      case 'ORCHID': var color = 'DA70D6'; break;
      case 'GOLDENROD': var color = 'DAA520'; break;
      case 'PALEVIOLETRED': var color = 'DB7093'; break;
      case 'CRIMSON': var color = 'DC143C'; break;
      case 'GAINSBORO': var color = 'DCDCDC'; break;
      case 'PLUM': var color = 'DDA0DD'; break;
      case 'BURLYWOOD': var color = 'DEB887'; break;
      case 'LIGHTCYAN': var color = 'E0FFFF'; break;
      case 'LAVENDER': var color = 'E6E6FA'; break;
      case 'DARKSALMON': var color = 'E9967A'; break;
      case 'VIOLET': var color = 'EE82EE'; break;
      case 'PALEGOLDENROD': var color = 'EEE8AA'; break;
      case 'LIGHTCORAL': var color = 'F08080'; break;
      case 'KHAKI': var color = 'F0E68C'; break;
      case 'ALICEBLUE': var color = 'F0F8FF'; break;
      case 'HONEYDEW': var color = 'F0FFF0'; break;
      case 'AZURE': var color = 'F0FFFF'; break;
      case 'SANDYBROWN': var color = 'F4A460'; break;
      case 'WHEAT': var color = 'F5DEB3'; break;
      case 'BEIGE': var color = 'F5F5DC'; break;
      case 'WHITESMOKE': var color = 'F5F5F5'; break;
      case 'MINTCREAM': var color = 'F5FFFA'; break;
      case 'GHOSTWHITE': var color = 'F8F8FF'; break;
      case 'SALMON': var color = 'FA8072'; break;
      case 'ANTIQUEWHITE': var color = 'FAEBD7'; break;
      case 'LINEN': var color = 'FAF0E6'; break;
      case 'LIGHTGOLDENRODYELLOW': var color = 'FAFAD2'; break;
      case 'OLDLACE': var color = 'FDF5E6'; break;
      case 'RED': var color = 'FF0000'; break;
      case 'FUCHSIA': var color = 'FF00FF'; break;
      case 'MAGENTA': var color = 'FF00FF'; break;
      case 'DEEPPINK': var color = 'FF1493'; break;
      case 'ORANGERED': var color = 'FF4500'; break;
      case 'TOMATO': var color = 'FF6347'; break;
      case 'HOTPINK': var color = 'FF69B4'; break;
      case 'CORAL': var color = 'FF7F50'; break;
      case 'DARKORANGE': var color = 'FF8C00'; break;
      case 'LIGHTSALMON': var color = 'FFA07A'; break;
      case 'ORANGE': var color = 'FFA500'; break;
      case 'LIGHTPINK': var color = 'FFB6C1'; break;
      case 'PINK': var color = 'FFC0CB'; break;
      case 'GOLD': var color = 'FFD700'; break;
      case 'PEACHPUFF': var color = 'FFDAB9'; break;
      case 'NAVAJOWHITE': var color = 'FFDEAD'; break;
      case 'MOCCASIN': var color = 'FFE4B5'; break;
      case 'BISQUE': var color = 'FFE4C4'; break;
      case 'MISTYROSE': var color = 'FFE4E1'; break;
      case 'BLANCHEDALMOND': var color = 'FFEBCD'; break;
      case 'PAPAYAWHIP': var color = 'FFEFD5'; break;
      case 'LAVENDERBLUSH': var color = 'FFF0F5'; break;
      case 'SEASHELL': var color = 'FFF5EE'; break;
      case 'CORNSILK': var color = 'FFF8DC'; break;
      case 'LEMONCHIFFON': var color = 'FFFACD'; break;
      case 'FLORALWHITE': var color = 'FFFAF0'; break;
      case 'SNOW': var color = 'FFFAFA'; break;
      case 'YELLOW': var color = 'FFFF00'; break;
      case 'LIGHTYELLOW': var color = 'FFFFE0'; break;
      case 'IVORY': var color = 'FFFFF0'; break;
      case 'WHITE': var color = 'FFFFFF'; break;
      default: var color = 'ffffff'; break;
    }
  }
  var r = parseInt(color.substring(0, 2), 16)
  var g = parseInt(color.substring(2, 4), 16)
  var b = parseInt(color.substring(4, 6), 16)
  return (((r*0.299)+(g*0.587)+(b*0.114))>186) ? darkColor : lightColor
}
