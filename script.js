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
  grid.style.gridTemplateRows = `repeat(7, 15px)`;
  grid.style.gridTemplateColumns = `repeat(53, 15px)`;
}

let isMouseDown = false;
let isSelecting = true; // Sporer om vi aktiverer eller deaktiverer celler

// Når musen trykkes ned
grid.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('cell')) {
    isMouseDown = true;
    isSelecting = !e.target.classList.contains('active'); // Sjekk status på cellen
    e.target.classList.toggle('active', isSelecting); // Endre status
  }
});

// Når musen beveger seg over gridet
grid.addEventListener('mousemove', (e) => {
  if (isMouseDown && e.target.classList.contains('cell')) {
    if (e.target.classList.contains('active') !== isSelecting) {
      e.target.classList.toggle('active', isSelecting);
    }
  }
});

// Når musen slippes
document.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// Støtter klikk uten dra
grid.addEventListener('click', (e) => {
  if (!isMouseDown && e.target.classList.contains('cell')) {
    e.target.classList.toggle('active');
  }
});

generateGrid(2023); // Bytt ut året for testing

// Årvelger
document.getElementById('year-selector').addEventListener('change', (e) => {
  generateGrid(parseInt(e.target.value, 10));
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
