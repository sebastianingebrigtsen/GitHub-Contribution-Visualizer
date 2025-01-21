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
      const currentDate = new Date(year, 0, currentIndex + 1); // Beregn dato basert på årets start

      // Sjekk om vi er innenfor årets dager
      if (currentDate >= startDate && currentDate <= endDate) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        // Legg til dato som attributt for senere bruk
        const currentDate = new Date(year, 0, currentIndex + 1, 12);
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

document.getElementById('generate-script').addEventListener('click', () => {
  const cells = document.querySelectorAll('.cell');
  const today = new Date(); // Startdato
  const startDate = new Date(today.getFullYear(), 0, 1); // 1. januar
  let script = '#!/bin/bash\n\n';

  cells.forEach((cell, index) => {
    if (cell.classList.contains('active')) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + index); // Beregn dato for cellen
      script += `GIT_AUTHOR_DATE="${date.toISOString()}" `;
      script += `GIT_COMMITTER_DATE="${date.toISOString()}" `;
      script += `git commit --allow-empty -m "Commit on ${date.toDateString()}"\n`;
    }
  });

  document.getElementById('script-output').value = script;
});

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
    e.target.classList.toggle('active', isSelecting);
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

generateGrid(2025); // Bytt ut året for testing
