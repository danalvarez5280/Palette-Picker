var color1 = $('.color1');
var color2 = $('.color2');
var color3 = $('.color3');
var color4 = $('.color4');
var color5 = $('.color5');
var fiveColors = [color1, color2, color3, color4, color5];

generateColors()

function generateColors () {
  fiveColors.map(function(elem) {
    var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    elem.innerHTML = randomColor;
    elem.text(randomColor.toUpperCase());
    elem.css('background-color', randomColor);
  });
};

function addSelectOption (projectName) {
  $('#projects').append(`<option class=${projectName} value='${projectName}'>${projectName}</option>`);
};

function addProjectAndPalette (projectName, paletteName, savedPalette) {
  $('#saved-projects').append(
    `<div class='saved-project ${projectName}'>
      <h2>${projectName}</h2>
      <h3>${paletteName}</h3>
      <section class='${projectName}'>
        <div class='choices'>
          ${savedPalette}
          <div class='btn delete-btn'></div>
        </div>
      </section>
    </div>`)
};

function addPalette (projectName, paletteName, savedPalette) {
  $(`.${projectName}`).last().append(
    `<h3>${paletteName}</h3>
    <section class='${projectName}'>
      <div class='choices'>
        ${savedPalette}
        <div class='btn delete-btn'></div>
      </div>`
  )
}


function saveProject () {
  var projectName = $('#project-name').val() || $('#projects').val() || 'JohnSnow';
  var paletteName = $('#palette-name').val() || 'Go Broncos!';
  var savedPalette = fiveColors.map(function(elem) {
    return `<div class='saved-color' style='background-color:${elem.innerHTML}'></div>`;
  });
  if(!$(`option.${projectName}`).html()) {
    addSelectOption(`${projectName}`);
  }

  if(!$(`div.${projectName}`).html()) {
    addProjectAndPalette (`${projectName}`, `${paletteName}`, `${savedPalette}`);
  }

  else if ($(`div.${projectName}`).html()) {
    addPalette(`${projectName}`, `${paletteName}`, `${savedPalette}`);
  }
    $('#project-name').val('');
    $('#palette-name').val('');
};

$('.gen-btn').on('click', generateColors);
$('.save-btn').on('click', saveProject);
