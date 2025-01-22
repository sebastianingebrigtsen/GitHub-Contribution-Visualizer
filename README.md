# GitHub Contribution Visualizer

En webapplikasjon som lar brukere designe og visualisere sine GitHub-bidragsgrafer. Lag tilpassede mønstre, generer skript for commits, og publiser dem til ditt GitHub-repositorium med enkelhet.

## Live Demo

Du kan få tilgang til applikasjonen her: [GitHub Contribution Visualizer](https://github-contribution-visualizer.web.app/)

## Funksjoner

- **Interaktivt rutenett:** Klikk og velg celler for å designe ditt bidragsmønster.
- **Dynamisk årvelger:** Generer bidragsrutenett for alle år fra 2006 til inneværende år.
- **Skriptgenerator:** Automatisk generering av bash-skript for å lage commits som samsvarer med ditt mønster.
- **Mørk og lys modus:** Bytt mellom mørkt og lyst tema for bedre brukeropplevelse.
- **Responsivt design:** Fungerer sømløst på ulike skjermstørrelser.

## Teknologier brukt

- **Frontend:** HTML, CSS, JavaScript
- **Hosting:** Firebase Hosting

## Kom i gang

### Klon repositoriet

```bash
git clone https://github.com/<ditt-brukernavn>/github-contribution-visualizer.git
cd github-contribution-visualizer
```

### Installer avhengigheter (hvis aktuelt)

Dette prosjektet har ingen backend eller pakkebiblioteker. Det kan hostes som statiske filer.

### Lokal kjøring

1. Åpne `index.html`-filen i nettleseren din for å teste applikasjonen lokalt.

### Publisering til Firebase

For å publisere applikasjonen til Firebase Hosting:

1. Sørg for at Firebase CLI er installert:

   ```bash
   npm install -g firebase-tools
   ```

2. Logg inn på Firebase:

   ```bash
   firebase login
   ```

3. Initialiser Firebase i prosjektmappen:

   ```bash
   firebase init
   ```

4. Publiser applikasjonen:
   ```bash
   firebase deploy
   ```

## Bruk

1. Åpne applikasjonen på [GitHub Contribution Visualizer](https://github-contribution-visualizer.web.app/).
2. Velg et år fra rullegardinmenyen for å laste inn bidragsrutenettet for det året.
3. Klikk på celler i rutenettet for å designe ditt bidragsmønster.
4. Klikk på **Generer Script** for å lage et bash-skript.
5. Kopier skriptet og kjør det i terminalen for å pushe commits til ditt GitHub-repositorium.

## Lisens

Dette prosjektet er åpen kildekode og tilgjengelig under [MIT-lisensen](LICENSE).

---

Bidra gjerne til dette prosjektet eller foreslå nye funksjoner!
