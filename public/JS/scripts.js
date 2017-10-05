
const genRandomColors = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const displayColors = () => {
  headerColor()
  titleColor()
  for (let i = 1; i < 6; i++) {
    if (!$(`.color${i}`).hasClass('locked')) {
      let color = genRandomColors();
      $(`.color${i}`).css('background-color', color);
      $(`.hex${i}`).text(color);
    }
  }
};

const headerColor = () => {
  const header = $('header');
  let newColor = genRandomColors();
  header.css('background-color', newColor);
};

const titleColor = () => {
  const title = $('h1');
  let newColor = genRandomColors();
  title.css('color', newColor);
};

const addSelectOption = (projectName) => {
  let newOption = `<option class=${projectName} value='${projectName}'>${projectName}</option>`
  $('#projects').append(newOption);
};

const addProjectAndPalette = (projectName, paletteName, savedPalette) => {
  let newPalette =`<div class='saved-project ${projectName}'>
    <h2>${projectName}</h2>
    <h3>${paletteName}</h3>
    <section class='${projectName}'>
      <div class='choices'>
        ${savedPalette}
        <div class='btn delete-btn'></div>
      </div>
    </section>
  </div>`
  $('#saved-projects').append(newPalette)
};

const addPalette = (projectName, paletteName, savedPalette) => {
  $(`.${projectName}`).last().append(
    `<h3>${paletteName}</h3>
    <section class='${projectName}'>
      <div class='choices'>
        ${savedPalette}
        <div class='btn delete-btn'></div>
      </div>`
  )
};

const saveProject = () => {
  const projectName = $('#project-name').val() || $('#projects').val() || 'JohnSnow';
  const paletteName = $('#palette-name').val() || 'Go Broncos!';
  const fiveColors = [$('.color1'), $('.color2'), $('.color3'), $('.color4'), $('.color5')];
  const savedPalette = fiveColors.map(elem => {
    let hexcode = elem.text();
    return `<div class='saved-color' style='background-color:${hexcode}'></div>`;
  });

  const hexCodes = () => {
    fiveColors.map(elem => {
      return elem.text
    })
  }

  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ name : `${projectName}` }),
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(project => console.log('hi yall', project))

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

const lockColor = (e) => {
  console.log(e.target);
  $(e.target).toggleClass('lock');
  $(e.target).parents('.color').toggleClass('locked')
}



$(document).ready(displayColors);
$('.gen-btn').on('click', displayColors);
$('.save-btn').on('click', saveProject);
$('.no-lock').on('click', lockColor);
