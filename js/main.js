var numberLessons = 6
var numberSubjects = 0
var autoSave = localStorage.getItem('auto_save')

$(document).scroll(function(){
  $('header').toggleClass('header-shadow', $(this).scrollTop() > 0);
})

$(document).ready(function(){
  var lang = getQueryVariable('lang')
  if (lang != false) setup(lang)
  else setup('en')
})

let deferredPrompt

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  $('#install_now').removeClass('invisible')
})

function install() {
  deferredPrompt.prompt()
}

function setup(language) {
  for (var i = 1; i <= 6; i++) {
    var k = '<tr><th>' + i + '</th>'
    for (var j = 1; j <= 5; j++) {
      k += '<td id="' + i + j + '" ondrop="drop(event, this)" ondragover="allowDrop(event)"></td>'
    }
    k += '</tr>'
    $('table').append(k)
  }

  if (autoSave == 'true') {
    $('#autoSaveSwitch').prop('checked', true)
    loadFromObject(localStorage.getItem('auto_save_obj'))
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
    $('#load_label').html('<input id="load" type="file" onchange="loadFromFile()" accept=".json">' + string_load)

    $('#printing').html(string_printing)
    $('#print_timetable').html(string_print_timetable)
    $('#printing_color_warning').html(string_printing_color_warning)

    $('#install').html(string_install)
    $('#install_text').html(string_install_text)
    $('#install_now').html(string_install_now)

    $('#language').html(string_language)
    $('#english').html(string_english)
    $('#german').html(string_german)

    $('#settings').html(string_settings)
    $('#auto_save').html(string_auto_save)

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

function drop(ev, el) {
    ev.preventDefault()
    var data = ev.dataTransfer.getData('text')
    el.appendChild(document.getElementById(data))
    if (autoSave) {
      localStorage.setItem('auto_save_obj', generateSaveObj())
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] == variable) return pair[1]
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
    $('#edit_subject_dialog_input').val('')
  })
  $('#edit_subject_dialog').removeClass('invisible')
}

function addSubject() {
  $('#subject_dialog_btn_positive').off('click').on('click', function() {
    var subject = $('#subject_dialog_name').val()
    var bgColor = $('#subject_dialog_color').val()
    if (subject === '') subject = string_default_subject
    if (bgColor === '') bgColor = string_default_color
    $('span#new').append(
      '<div id="drag' + numberSubjects + '" class="subject" draggable="true" ondragstart="drag(event)" style="background:'
      + bgColor + ';color:' + pickTextColor(bgColor) + '">' + subject + '</div>'
    )
    numberSubjects++
    $('#subject_dialog_name, #subject_dialog_color').val('')
    $('#subject_dialog').addClass('invisible')
  })
  $('#subject_dialog_btn_negative').off('click').on('click', function() {
    $('#subject_dialog').addClass('invisible')
    $('#subject_dialog_name, #subject_dialog_color').val('')
  })
  $('#subject_dialog').removeClass('invisible')
}

function addLesson() {
  numberLessons++
  var k = '<tr class="additional"><th>' + numberLessons + '</th>'
  for (var i = 1; i <= 5; i++) {
    k += '<td id="' + numberLessons + i + '" ondrop="drop(event, this)" ondragover="allowDrop(event)"></td>'
  }
  k += '</tr>'
  $('table').append(k)
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
        numberLessons = 6
      }, function() {})
}

function changeName() {
  if ($('#edit .subject').length) {
    makeEditDialog(string_change_name, string_enter_new_subject, string_default_subject, function() {
      var subject = $('#edit_subject_dialog_input').val()
      if (subject === '') bgColor = string_default_subject
      $('#edit .subject').html(subject)
    })
  } else {
    makeDialog(string_change_name, string_put_subject_in_editing_area)
  }
}

function changeColor() {
  if ($('#edit .subject').length) {
    makeEditDialog(string_change_color, string_enter_new_color, string_default_color, function() {
      var bgColor = $('#edit_subject_dialog_input').val()
      if (bgColor === '') bgColor = string_default_color
      $('#edit .subject').css('background',bgColor)
      $('#edit .subject').css('color',pickTextColor(bgColor))
    })
  } else {
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

const hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f")

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16]
}

function generateSaveObj() {
  var subjectsObj = {}
  for (var i = 1; i <= numberLessons; i++) {
    for (var j = 1; j <= 5; j++) {
      var id = String(i) + j
      var innerHTML = document.getElementById(id).innerHTML
      if (innerHTML != '') {
        var subject = document.getElementById(id).firstChild
        var subjectObj = {}
        subjectObj['name'] = subject.innerHTML
        subjectObj['color'] = subject.style.background
        subjectsObj[id] = subjectObj
      }
    }
  }
  var saveObj = {}
  saveObj['numberLessons'] = numberLessons
  saveObj['subjects'] = subjectsObj
  return JSON.stringify(saveObj)
}

function saveToFile() {
  var hiddenElement = document.createElement('a')
  hiddenElement.href = 'data:attachment/text,' + encodeURI(generateSaveObj()).replace(/#/g, '%23')
  hiddenElement.target = '_blank'
  hiddenElement.download = string_default_file_name + '.json'
  hiddenElement.click()
}

function loadFromObject(loadObj) {
  $('.additional, .subject').remove()
  numberLessons = 6
  numberSubjects = 0
  var loadObj = JSON.parse(loadObj)
  for (var i = 0; i < loadObj['numberLessons'] - 6; i++) {
    addLesson()
  }
  var subjects = loadObj['subjects']
  for (const id in subjects) {
    $('#' + id).append(
      '<div id="drag' + numberSubjects + '" class="subject" draggable="true" ondragstart="drag(event)" style="background:'
      + subjects[id].color + ';color:' + pickTextColor(subjects[id].color) + '">' + subjects[id].name + '</div>'
    )
    numberSubjects++
  }
}

function loadFromFile() {
  var file = document.getElementById('load').files[0]
  var ext = getExtension(document.getElementById('load').value)
  if (file && ext.toLowerCase() == 'json') {
    var reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (evt) {
      loadFromObject(reader.result)
      if (autoSave) {
        localStorage.setItem('auto_save_obj', generateSaveObj())
      }
    }
    reader.onerror = function (evt) {
      console.log(evt)
    }
  } else if (file && ext.toLowerCase() != 'json')
    makeDialog(string_load, string_file_format_not_supported)
}

function onAutoSaveChanged() {
  autoSave = $('#autoSaveSwitch').prop('checked')
  localStorage.setItem('auto_save', autoSave)
}

function pickTextColor(inputColor) {
  var color = 'FFFFFF'
  if (inputColor.charAt(0) === '#' && inputColor.length === 7)
    color = inputColor.substring(1,7)
  else if (inputColor.charAt(0) === '#' && inputColor.length === 4)
    color = inputColor[1] + inputColor[1] + inputColor[2] + inputColor[2] + inputColor[3] + inputColor[3]
  else if (inputColor.startsWith('rgb('))
    color = rgb2hex(inputColor)
  else {
    switch (inputColor.toUpperCase()) {
      case 'BLACK': color = '000000'; break;
      case 'NAVY': color = '000080'; break;
      case 'DARKBLUE': color = '00008B'; break;
      case 'MEDIUMBLUE': color = '0000CD'; break;
      case 'BLUE': color = '0000FF'; break;
      case 'DARKGREEN': color = '006400'; break;
      case 'GREEN': color = '008000'; break;
      case 'TEAL': color = '008080'; break;
      case 'DARKCYAN': color = '008B8B'; break;
      case 'DEEPSKYBLUE': color = '00BFFF'; break;
      case 'DARKTURQUOISE': color = '00CED1'; break;
      case 'MEDIUMSPRINGGREEN': color = '00FA9A'; break;
      case 'LIME': color = '00FF00'; break;
      case 'SPRINGGREEN': color = '00FF7F'; break;
      case 'AQUA': color = '00FFFF'; break;
      case 'CYAN': color = '00FFFF'; break;
      case 'MIDNIGHTBLUE': color = '191970'; break;
      case 'DODGERBLUE': color = '1E90FF'; break;
      case 'LIGHTSEAGREEN': color = '20B2AA'; break;
      case 'FORESTGREEN': color = '228B22'; break;
      case 'SEAGREEN': color = '2E8B57'; break;
      case 'DARKSLATEGRAY': color = '2F4F4F'; break;
      case 'DARKSLATEGREY': color = '2F4F4F'; break;
      case 'LIMEGREEN': color = '32CD32'; break;
      case 'MEDIUMSEAGREEN': color = '3CB371'; break;
      case 'TURQUOISE': color = '40E0D0'; break;
      case 'ROYALBLUE': color = '4169E1'; break;
      case 'STEELBLUE': color = '4682B4'; break;
      case 'DARKSLATEBLUE': color = '483D8B'; break;
      case 'MEDIUMTURQUOISE': color = '48D1CC'; break;
      case 'INDIGO ': color = '4B0082'; break;
      case 'DARKOLIVEGREEN': color = '556B2F'; break;
      case 'CADETBLUE': color = '5F9EA0'; break;
      case 'CORNFLOWERBLUE': color = '6495ED'; break;
      case 'REBECCAPURPLE': color = '663399'; break;
      case 'MEDIUMAQUAMARINE': color = '66CDAA'; break;
      case 'DIMGRAY': color = '696969'; break;
      case 'DIMGREY': color = '696969'; break;
      case 'SLATEBLUE': color = '6A5ACD'; break;
      case 'OLIVEDRAB': color = '6B8E23'; break;
      case 'SLATEGRAY': color = '708090'; break;
      case 'SLATEGREY': color = '708090'; break;
      case 'LIGHTSLATEGRAY': color = '778899'; break;
      case 'LIGHTSLATEGREY': color = '778899'; break;
      case 'MEDIUMSLATEBLUE': color = '7B68EE'; break;
      case 'LAWNGREEN': color = '7CFC00'; break;
      case 'CHARTREUSE': color = '7FFF00'; break;
      case 'AQUAMARINE': color = '7FFFD4'; break;
      case 'MAROON': color = '800000'; break;
      case 'PURPLE': color = '800080'; break;
      case 'OLIVE': color = '808000'; break;
      case 'GRAY': color = '808080'; break;
      case 'GREY': color = '808080'; break;
      case 'SKYBLUE': color = '87CEEB'; break;
      case 'LIGHTSKYBLUE': color = '87CEFA'; break;
      case 'BLUEVIOLET': color = '8A2BE2'; break;
      case 'DARKRED': color = '8B0000'; break;
      case 'DARKMAGENTA': color = '8B008B'; break;
      case 'SADDLEBROWN': color = '8B4513'; break;
      case 'DARKSEAGREEN': color = '8FBC8F'; break;
      case 'LIGHTGREEN': color = '90EE90'; break;
      case 'MEDIUMPURPLE': color = '9370DB'; break;
      case 'DARKVIOLET': color = '9400D3'; break;
      case 'PALEGREEN': color = '98FB98'; break;
      case 'DARKORCHID': color = '9932CC'; break;
      case 'YELLOWGREEN': color = '9ACD32'; break;
      case 'SIENNA': color = 'A0522D'; break;
      case 'BROWN': color = 'A52A2A'; break;
      case 'DARKGRAY': color = 'A9A9A9'; break;
      case 'DARKGREY': color = 'A9A9A9'; break;
      case 'LIGHTBLUE': color = 'ADD8E6'; break;
      case 'GREENYELLOW': color = 'ADFF2F'; break;
      case 'PALETURQUOISE': color = 'AFEEEE'; break;
      case 'LIGHTSTEELBLUE': color = 'B0C4DE'; break;
      case 'POWDERBLUE': color = 'B0E0E6'; break;
      case 'FIREBRICK': color = 'B22222'; break;
      case 'DARKGOLDENROD': color = 'B8860B'; break;
      case 'MEDIUMORCHID': color = 'BA55D3'; break;
      case 'ROSYBROWN': color = 'BC8F8F'; break;
      case 'DARKKHAKI': color = 'BDB76B'; break;
      case 'SILVER': color = 'C0C0C0'; break;
      case 'MEDIUMVIOLETRED': color = 'C71585'; break;
      case 'INDIANRED ': color = 'CD5C5C'; break;
      case 'PERU': color = 'CD853F'; break;
      case 'CHOCOLATE': color = 'D2691E'; break;
      case 'TAN': color = 'D2B48C'; break;
      case 'LIGHTGRAY': color = 'D3D3D3'; break;
      case 'LIGHTGREY': color = 'D3D3D3'; break;
      case 'THISTLE': color = 'D8BFD8'; break;
      case 'ORCHID': color = 'DA70D6'; break;
      case 'GOLDENROD': color = 'DAA520'; break;
      case 'PALEVIOLETRED': color = 'DB7093'; break;
      case 'CRIMSON': color = 'DC143C'; break;
      case 'GAINSBORO': color = 'DCDCDC'; break;
      case 'PLUM': color = 'DDA0DD'; break;
      case 'BURLYWOOD': color = 'DEB887'; break;
      case 'LIGHTCYAN': color = 'E0FFFF'; break;
      case 'LAVENDER': color = 'E6E6FA'; break;
      case 'DARKSALMON': color = 'E9967A'; break;
      case 'VIOLET': color = 'EE82EE'; break;
      case 'PALEGOLDENROD': color = 'EEE8AA'; break;
      case 'LIGHTCORAL': color = 'F08080'; break;
      case 'KHAKI': color = 'F0E68C'; break;
      case 'ALICEBLUE': color = 'F0F8FF'; break;
      case 'HONEYDEW': color = 'F0FFF0'; break;
      case 'AZURE': color = 'F0FFFF'; break;
      case 'SANDYBROWN': color = 'F4A460'; break;
      case 'WHEAT': color = 'F5DEB3'; break;
      case 'BEIGE': color = 'F5F5DC'; break;
      case 'WHITESMOKE': color = 'F5F5F5'; break;
      case 'MINTCREAM': color = 'F5FFFA'; break;
      case 'GHOSTWHITE': color = 'F8F8FF'; break;
      case 'SALMON': color = 'FA8072'; break;
      case 'ANTIQUEWHITE': color = 'FAEBD7'; break;
      case 'LINEN': color = 'FAF0E6'; break;
      case 'LIGHTGOLDENRODYELLOW': color = 'FAFAD2'; break;
      case 'OLDLACE': color = 'FDF5E6'; break;
      case 'RED': color = 'FF0000'; break;
      case 'FUCHSIA': color = 'FF00FF'; break;
      case 'MAGENTA': color = 'FF00FF'; break;
      case 'DEEPPINK': color = 'FF1493'; break;
      case 'ORANGERED': color = 'FF4500'; break;
      case 'TOMATO': color = 'FF6347'; break;
      case 'HOTPINK': color = 'FF69B4'; break;
      case 'CORAL': color = 'FF7F50'; break;
      case 'DARKORANGE': color = 'FF8C00'; break;
      case 'LIGHTSALMON': color = 'FFA07A'; break;
      case 'ORANGE': color = 'FFA500'; break;
      case 'LIGHTPINK': color = 'FFB6C1'; break;
      case 'PINK': color = 'FFC0CB'; break;
      case 'GOLD': color = 'FFD700'; break;
      case 'PEACHPUFF': color = 'FFDAB9'; break;
      case 'NAVAJOWHITE': color = 'FFDEAD'; break;
      case 'MOCCASIN': color = 'FFE4B5'; break;
      case 'BISQUE': color = 'FFE4C4'; break;
      case 'MISTYROSE': color = 'FFE4E1'; break;
      case 'BLANCHEDALMOND': color = 'FFEBCD'; break;
      case 'PAPAYAWHIP': color = 'FFEFD5'; break;
      case 'LAVENDERBLUSH': color = 'FFF0F5'; break;
      case 'SEASHELL': color = 'FFF5EE'; break;
      case 'CORNSILK': color = 'FFF8DC'; break;
      case 'LEMONCHIFFON': color = 'FFFACD'; break;
      case 'FLORALWHITE': color = 'FFFAF0'; break;
      case 'SNOW': color = 'FFFAFA'; break;
      case 'YELLOW': color = 'FFFF00'; break;
      case 'LIGHTYELLOW': color = 'FFFFE0'; break;
      case 'IVORY': color = 'FFFFF0'; break;
      case 'WHITE': color = 'FFFFFF'; break;
    }
  }
  var r = parseInt(color.substring(0, 2), 16)
  var g = parseInt(color.substring(2, 4), 16)
  var b = parseInt(color.substring(4, 6), 16)
  return (((r*0.299)+(g*0.587)+(b*0.114))>186) ? 'black' : 'white'
}
