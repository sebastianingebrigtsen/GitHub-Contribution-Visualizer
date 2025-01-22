//Grid
const grid = document.getElementById('grid');

function generateGrid(year) {
  grid.innerHTML = ''; // Tøm eksisterende grid

  const startDate = new Date(year, 0, 1); // 1. januar
  const endDate = new Date(year, 11, 31); // 31. desember
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Antall dager i året
  const startDay = startDate.getDay(); // Ukedagen for 1. januar (0 = Søndag, 1 = Mandag, ...)

  // Lag grid (53 kolonner, 7 rader)
  for (let day = 0; day < 7; day++) {
    // Iterer over dagene i uken
    for (let week = 0; week < 53; week++) {
      // Iterer over ukene
      const currentIndex = week * 7 + day - startDay; // Juster indeksen basert på startdagen
      let currentDate = new Date(year, 0, currentIndex + 1); // Beregn dato basert på årets start

      // Sjekk om vi er innenfor årets dager
      if (currentDate >= startDate && currentDate <= endDate) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        // Legg til dato som attributt for senere bruk
        let currentDate = new Date(year, 0, currentIndex + 1, 12);
        cell.dataset.date = currentDate.toISOString().split('T')[0];

        // Legg til klikkhendelse for testing
        cell.addEventListener('click', () => {
          console.log(`Clicked date: ${cell.dataset.date}`);
        });

        grid.appendChild(cell);
      } else {
        // Tom celle for uker utenfor årets dager
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('empty');
        grid.appendChild(emptyCell);
      }
    }
  }

  // Sett grid-layout basert på riktig rekkefølge
  grid.style.gridTemplateRows = `repeat(7, 20px)`;
  grid.style.gridTemplateColumns = `repeat(53, 20px)`;
}

let isMouseDown = false;
let isSelecting = null;

grid.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('cell')) {
    isMouseDown = true;
    isSelecting = !e.target.classList.contains('active');
    e.target.classList.toggle('active', isSelecting); // Toggles den første cellen
  }
  e.preventDefault();
});

grid.addEventListener('mousemove', (e) => {
  if (isMouseDown && e.target.classList.contains('cell')) {
    e.target.classList.toggle('active', isSelecting);
  }
});

document.addEventListener('mouseup', () => {
  isMouseDown = false;
  isSelecting = null;
});

generateGrid(2025); // Bytt ut året for testing

// Generer årvalgene dynamisk
function populateYearSelector() {
  const yearSelector = document.getElementById('year-selector');
  const currentYear = new Date().getFullYear(); // Hent inneværende år
  const startYear = 2006; // Startår for listen
  const endYear = currentYear; // Legg til neste år

  // Tøm eksisterende valg
  yearSelector.innerHTML = '';

  // Generer årvalg
  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    if (year === currentYear) {
      option.selected = true; // Sett inneværende år som standard
    }
    yearSelector.appendChild(option);
  }
}

// Initialiser årvelgeren
populateYearSelector();

// Legg til event listener for endring av år
document.getElementById('year-selector').addEventListener('change', (e) => {
  generateGrid(parseInt(e.target.value, 10)); // Generer grid for valgt år
});

//script generator
document.getElementById('generate-script').addEventListener('click', () => {
  const cells = document.querySelectorAll('.cell'); // Hent alle celler i gridet
  const year = 2025; // Endre til ønsket år (eller hent fra brukerinput hvis mulig)
  const startDate = new Date(year, 0, 1); // 1. januar for valgt år
  let script = '#!/bin/bash\n\n';

  // Start et nytt git-repository i scriptet
  script += 'mkdir github-contributions && cd github-contributions\n';
  script += 'git init\n\n';

  cells.forEach((cell) => {
    if (cell.classList.contains('active') && cell.dataset.date) {
      // Beregn riktig dato basert på cellens plassering og år
      const date = new Date(cell.dataset.date);

      // Lag commit-kommandolinje
      script += `GIT_AUTHOR_DATE="${date.toISOString()}" `;
      script += `GIT_COMMITTER_DATE="${date.toISOString()}" `;
      script += `git commit --allow-empty -m "Commit on ${date.toDateString()}"\n`;
    }
  });

  // Legg til instruksjoner for å pushe til GitHub
  script += '\n# Push til GitHub\n';
  script += 'git branch -M main\n';
  script += 'git remote add origin <URL-til-repository>\n';
  script += 'git push -u origin main\n';

  // Vis scriptet i tekstområdet
  document.getElementById('script-output').value = script;
});

// Hent toggle og body
const themeCheckbox = document.getElementById('theme-checkbox');

// Definer fargepaletter for hvert tema
const themes = {
  light: {
    '--background-color': '#FFFFFF', // gjort
    '--text-color': '#1F2328', // gjort
    '--primary-color': '#216E39', // gjort
    '--secondary-color': '#EBEDF0', // gjort
    '--tertiary-color': '#EFF2F5',
    '--border-color': '#D1D9E0', // gjort
    '--hover-color': '#9BE9A8', // gjort
    '--header-color': '#F6F8FA', //gjort
  },
  dark: {
    '--background-color': '#0D1117', // gjort
    '--text-color': '#ffffff',
    '--primary-color': '#46D353',
    '--secondary-color': '#161B22', // gjort
    '--tertiary-color': '#262b36',
    '--border-color': '#3D444D', // gjort
    '--hover-color': '#216E39',
    '--header-color': '#010409',
  },
};

// Funksjon for å bytte tema
function applyTheme(theme) {
  const root = document.documentElement; // Hoved :root-element
  const themeColors = themes[theme];
  for (const [key, value] of Object.entries(themeColors)) {
    root.style.setProperty(key, value); // Oppdater CSS-variabelen
  }
}

// Sett dark mode som standard
document.addEventListener('DOMContentLoaded', () => {
  themeCheckbox.checked = true; // Sett toggle på
  applyTheme('dark'); // Bruk dark mode
});

// Bytt tema ved toggle
themeCheckbox.addEventListener('change', () => {
  if (themeCheckbox.checked) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
});

document.getElementById('copy-script').addEventListener('click', () => {
  const scriptOutput = document.getElementById('script-output'); // Hent tekstområdet
  const popup = document.getElementById('copy-popup'); // Hent popup-elementet

  // Kopier tekst til utklippstavlen
  navigator.clipboard
    .writeText(scriptOutput.value)
    .then(() => {
      // Vis popup-melding
      popup.classList.add('show');

      // Skjul popup etter 2 sekunder
      setTimeout(() => {
        popup.classList.remove('show');
      }, 2000);
    })
    .catch((err) => {
      console.error('Kunne ikke kopiere til utklippstavlen:', err);
    });
});
