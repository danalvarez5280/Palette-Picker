
//appends the pallets saved for each project
const appendPalette = (palette) => {
  const hexCodes = [
    palette.hex1,
    palette.hex2,
    palette.hex3,
    palette.hex4,
    palette.hex5
  ];
  const savedColors = hexCodes.map(color =>
    `<div class='saved-color' style='background-color:${color}'></div>`);

  const savedPalette =
  `<div id='${palette.id}' class='user-palette'>
    <h3>${palette.name}</h3>
    <div class='choices'>
    ${savedColors}
    <div class='delete-btn'></div>
    </div>
  </div>`
  ;

  $(`#project-${palette.project_id}`).append(savedPalette);
};

//appends saved projects name
const appendProject = (project) => {
  const newPalette =
  `<div class='saved-project' id='project-${project.id}'>
    <h2>${project.name}</h2>
  </div>`
  $('#saved-projects').append(newPalette)
};

//aapends a new dropdown select option
const appendSelectOption = (project) => {
  appendProject(project)
  let newOption = `<option class=${project.name} value='${project.id}'>${project.name}</option>`
  $('#projects').append(newOption);
};

//displays the random color palette on the DOM
const displayColors = () => {
  headerColor()
  h1Color()
  for (let i = 1; i < 6; i++) {
    if (!$(`.color${i}`).hasClass('locked')) {
      let color = genRandomColors();
      $(`.color${i}`).css('background-color', color);
      $(`.hex${i}`).text(color);
    }
  }
};

//deletes the palette from the database and DOM
const fetchDelete = (e) => {
  const palette = $(e.target).closest('.user-palette');
  const id = palette.attr('id');

  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
  .then(() => $(`.${id}`).remove())
  .catch(error => console.log('The worst', error))

  palette.remove()
};

//gets all the palettes from the database
const fetchPalettes = () => {
  fetch('/api/v1/palettes', {
    method: 'GET'
  })
  .then(data => data.json())
  .then(palettes => palettes.map(palette => appendPalette(palette)))
  .catch(error => console.log('You remind me of Trump', error))
};

//fetches all the projects from the database
const fetchProjects = () => {
  fetch('/api/v1/projects', {
    method: 'GET'
  })
  .then(data => data.json())
  .then(projects => projects.map(project => appendSelectOption(project)))
  .catch(error => console.log('You smell', error))
};

//fetches a specific project id associated with a user input 'name'
const fetchProjectId = (paletteName, hexCodes, name) => {
  fetch(`/api/v1/projects/${name}`, {
    method: 'GET'
  })
  .then(data => data.json())
  .then(project => postPalette(paletteName, hexCodes, project.id))
  .catch(error => console.log('error dummy', error))
};

//function that randomly generates one color
const genRandomColors = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
};

//function that randomly changes the color of the header
const headerColor = () => {
  const header = $('header');
  let newColor = genRandomColors();
  header.css('background-color', newColor);
};

//function that randomly changes the h1 color
const h1Color = () => {
  const title = $('h1');
  let newColor = genRandomColors();
  title.css('color', newColor);
};

//locks an individual color
const lockColor = (e) => {
  $(e.target).toggleClass('lock');
  $(e.target).parents('.color').toggleClass('locked')
};

//handles the functions i call on a page load
//randomly get colors for the palette
//retrieve all projects from the database
//retrieves all palettes from the database
const pageLoad = () => {
  displayColors();
  fetchProjects();
  fetchPalettes();
}

//saves a palette to the datbase
const postPalette = (paletteName, hexCodes, projectIdentifier) => {
  fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify({
      name: paletteName,
      hex1: hexCodes[0],
      hex2: hexCodes[1],
      hex3: hexCodes[2],
      hex4: hexCodes[3],
      hex5: hexCodes[4],
      project_id: projectIdentifier,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(data => data.json())
  // .then(thing => console.log('thing', thing))
  .then(palette => appendPalette(palette[0]))
  .catch(error => console.log('why you soooo dumb', error))
};

//saves a project to the database
const postProject = (projectName) => {
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ name: projectName }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(data => data.json())
  .then(project => appendSelectOption(project[0]))
  .catch(error => console.log('why you dumb', error))
};

//the function that handles the information submitted by the user
const saveProject = () => {
  const projectName = $('#project-name').val();
  const projectIdentifier = $('#project-name').val() || $('#projects').val() || 'JohnSnow';
  const paletteName = $('#palette-name').val() || 'Go Broncos!';
  const hexCodes = [
    $('.hex1').text(),
    $('.hex2').text(),
    $('.hex3').text(),
    $('.hex4').text(),
    $('.hex5').text()
  ];

  if (projectIdentifier === $('#project-name').val() || projectIdentifier === 'JohnSnow'){
    postProject(projectIdentifier);
    fetchProjectId(paletteName, hexCodes, projectIdentifier);
  }
  else {
    postPalette(paletteName, hexCodes, projectIdentifier);
  }

  $('#project-name').val('');
  $('#palette-name').val('');
};

//event listeners
$(document).ready(pageLoad);
$('#saved-projects').on('click', '.delete-btn', fetchDelete);
$('.gen-btn').on('click', displayColors);
$('.save-btn').on('click', saveProject);
$('.no-lock').on('click', lockColor);
