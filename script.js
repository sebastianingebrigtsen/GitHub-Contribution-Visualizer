// Grid-element
const grid = document.getElementById('grid');

function generateGrid(year) {
  grid.innerHTML = ''; // Tøm eksisterende grid

  const startDate = new Date(year, 0, 1); // 1. januar for valgt år
  const endDate = new Date(year, 11, 31); // 31. desember for valgt år
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Antall dager i året
  const startDay = startDate.getDay(); // Ukedagen for 1. januar (0 = søndag, 1 = mandag, ...)

  // Opprett grid med 53 kolonner og 7 rader
  for (let day = 0; day < 7; day++) {
    for (let week = 0; week < 53; week++) {
      const currentIndex = week * 7 + day - startDay; // Beregn indeks basert på startdag
      let currentDate = new Date(year, 0, currentIndex + 1); // Beregn dato fra start

      if (currentDate >= startDate && currentDate <= endDate) {
        const cell = document.createElement('div');
        cell.classList.add('cell'); // Legg til celle-klassen

        let currentDate = new Date(year, 0, currentIndex + 1, 12); // Sett dato til klokken 12
        cell.dataset.date = currentDate.toISOString().split('T')[0]; // Lagre dato som data-attributt

        // Klikk-hendelse for testing
        cell.addEventListener('click', () => {
          console.log(`Clicked date: ${cell.dataset.date}`);
        });

        grid.appendChild(cell); // Legg cellen til gridet
      } else {
        const emptyCell = document.createElement('div'); // Tom celle for dager utenfor året
        emptyCell.classList.add('empty');
        grid.appendChild(emptyCell);
      }
    }
  }

  grid.style.gridTemplateRows = `repeat(7, 20px)`; // Definer antall rader
  grid.style.gridTemplateColumns = `repeat(53, 20px)`; // Definer antall kolonner
}

// Variabler for dra-og-slipp-interaksjon
let isMouseDown = false;
let isSelecting = null;

grid.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('cell')) {
    isMouseDown = true;
    isSelecting = !e.target.classList.contains('active'); // Toggle for aktiv status
    e.target.classList.toggle('active', isSelecting);
  }
  e.preventDefault();
});

grid.addEventListener('mousemove', (e) => {
  if (isMouseDown && e.target.classList.contains('cell')) {
    e.target.classList.toggle('active', isSelecting); // Fortsett aktivering/deaktivering
  }
});

document.addEventListener('mouseup', () => {
  isMouseDown = false;
  isSelecting = null;
});

// Generer grid for inneværende år
const currentYear = new Date().getFullYear(); // Hent inneværende år
generateGrid(currentYear);

// Dynamisk generering av år i dropdown
function populateYearSelector() {
  const yearSelector = document.getElementById('year-selector');
  const startYear = 2006; // Startår for listen
  const endYear = new Date().getFullYear(); // Sluttår er inneværende år

  yearSelector.innerHTML = ''; // Tøm eksisterende valg

  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    if (year === endYear) {
      option.selected = true; // Marker inneværende år som standard
    }
    yearSelector.appendChild(option);
  }
}

// Initialiser årvelger
populateYearSelector();

// Hendelse for å oppdatere grid ved år-endring
document.getElementById('year-selector').addEventListener('change', (e) => {
  generateGrid(parseInt(e.target.value, 10)); // Generer grid for valgt år
});

// Generer script basert på aktive celler
document.getElementById('generate-script').addEventListener('click', () => {
  const cells = document.querySelectorAll('.cell');
  const year = 2025; // Standardår for generering
  const startDate = new Date(year, 0, 1);
  let script = '#!/bin/bash\n\n';

  script += 'git init\n\n';

  cells.forEach((cell) => {
    if (cell.classList.contains('active') && cell.dataset.date) {
      const date = new Date(cell.dataset.date);
      script += `GIT_AUTHOR_DATE="${date.toISOString()}" `;
      script += `GIT_COMMITTER_DATE="${date.toISOString()}" `;
      script += `git commit --allow-empty -m "Commit on ${date.toDateString()}"\n`;
    }
  });

  script += '\n# Push til GitHub\n';
  script += 'git branch -M main\n';
  script += 'git remote add origin <URL-til-repository>\n';
  script += 'git push -u origin main\n';

  document.getElementById('script-output').value = script; // Vis script i tekstfelt
});

// Tema-bytte funksjonalitet
const themeCheckbox = document.getElementById('theme-checkbox');

const themes = {
  light: {
    '--background-color': '#FFFFFF',
    '--text-color': '#1F2328',
    '--primary-color': '#216E39',
    '--secondary-color': '#EBEDF0',
    '--tertiary-color': '#EFF2F5',
    '--border-color': '#D1D9E0',
    '--hover-color': '#9BE9A8',
    '--header-color': '#F6F8FA',
  },
  dark: {
    '--background-color': '#0D1117',
    '--text-color': '#ffffff',
    '--primary-color': '#46D353',
    '--secondary-color': '#161B22',
    '--tertiary-color': '#262b36',
    '--border-color': '#3D444D',
    '--hover-color': '#216E39',
    '--header-color': '#010409',
  },
};

function applyTheme(theme) {
  const root = document.documentElement;
  const themeColors = themes[theme];
  for (const [key, value] of Object.entries(themeColors)) {
    root.style.setProperty(key, value); // Oppdater CSS-variabler
  }
}

document.addEventListener('DOMContentLoaded', () => {
  themeCheckbox.checked = true; // Sett dark mode som standard
  applyTheme('dark');
});

themeCheckbox.addEventListener('change', () => {
  if (themeCheckbox.checked) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
});

// Kopier script til utklippstavlen
document.getElementById('copy-script').addEventListener('click', () => {
  const scriptOutput = document.getElementById('script-output');
  const popup = document.getElementById('copy-popup');

  navigator.clipboard
    .writeText(scriptOutput.value)
    .then(() => {
      popup.classList.add('show'); // Vis bekreftelse

      setTimeout(() => {
        popup.classList.remove('show'); // Skjul popup etter 2 sekunder
      }, 2000);
    })
    .catch((err) => {
      console.error('Kunne ikke kopiere til utklippstavlen:', err);
    });
});
