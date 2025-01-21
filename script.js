const grid = document.getElementById('grid');

// Generer 7x52 ruter
for (let i = 0; i < 7 * 52; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');

  // Legg til klikkhendelse for å veksle status
  cell.addEventListener('click', () => {
    cell.classList.toggle('active');
  });

  grid.appendChild(cell);
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
