let color1 = $('.color1');
let color2 = $('.color2');
let color3 = $('.color3');
let color4 = $('.color4');
let color5 = $('.color5');
let fiveColors = [color1, color2, color3, color4, color5];
let lockedColors = [];

generateColors()

function generateColors () {
  headerColor()
  titleColor()
  const colorChangers = [...fiveColors]
  colorChangers.map( elem => {
    const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    elem.innerHTML = randomColor;
    elem.last().text(randomColor.toUpperCase());
    elem.css('background-color', randomColor);
  });
};

function headerColor () {
  const header = $('header');
  const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  header.css('background-color', randomColor);
};

function titleColor () {
  const title = $('h1');
  const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  title.css('color', randomColor);
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
};


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

function lockColor (event) {
  const colorChangers = [...fiveColors]

  const colorId = event.target.id;
  const lockedColor = $(`#${colorId}`);
  const paletteId = lockedColor.parent()[0].id;
  const lockedPalette = lockedColor.parent();
  const palette = fiveColors.find(elem => elem[0].id === paletteId);
  const index = colorId - 1;

  lockedColor.toggleClass('lock');

  if (fiveColors.includes(palette)) {
    lockedColors.push(palette)
    return fiveColors.splice(index, 1)
  }
  else {
    const unLockedColor = lockedColors.find(elem => elem[0].id === paletteId);
    lockedColors.splice(index, 1)

    return fiveColors.splice(index, 0, unLockedColor)
  }

};



$('.gen-btn').on('click', generateColors);
$('.save-btn').on('click', saveProject);
$('.no-lock').on('click', lockColor);
