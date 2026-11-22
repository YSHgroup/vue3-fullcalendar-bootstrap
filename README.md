# Daymark — World Calendar

Daymark is a responsive, browser-only calendar for planning around public holidays in the **United States, United Kingdom, Singapore, Hong Kong, and Japan**.

**Live app:** [yshgroup.github.io/vue3-fullcalendar-bootstrap](https://yshgroup.github.io/vue3-fullcalendar-bootstrap/)

## What you can do

- Switch between month, week, day, and agenda views.
- Browse dates with the mini calendar, previous/next controls, or the Today button.
- Show or hide each country's public holidays independently.
- Add and remove personal events. They are saved in this browser's local storage; no account or application server is used.
- Use the calendar on desktop or mobile.

## Holiday data and privacy

Public holidays are fetched directly from the [Nager.Date API](https://date.nager.at/) by the browser. The app requests data for the calendar's visible year or years, caches successful responses for the current page session, and displays a message if the service is unavailable. An internet connection is needed to load holiday data.

Personal events stay in the browser's local storage. They are not sent to Daymark or stored on a server. Clearing this browser's site data will remove them.

## Run locally

Requirements: Node.js 24 and npm.

```sh
git clone https://github.com/YSHgroup/vue3-fullcalendar-bootstrap.git
cd vue3-fullcalendar-bootstrap
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Validate and build

```sh
npm run test:unit
npm run lint
npm run type-check
npm run build
npm run preview
```

The production build uses the `/vue3-fullcalendar-bootstrap/` base path for GitHub Pages. `npm run preview` serves the built app locally so the production output can be checked before deployment.

## Deployment

Pushing to `main` runs the GitHub Actions workflow in `.github/workflows/deploy.yml`. It installs the locked dependencies, runs unit tests and the production build, then deploys `dist/` to GitHub Pages. The repository's Pages source should be configured to **GitHub Actions**.

## Built with

- [Vue 3](https://vuejs.org/) and [Vue Router](https://router.vuejs.org/)
- [FullCalendar](https://fullcalendar.io/)
- [Bootstrap 5](https://getbootstrap.com/) and Bootstrap Icons
- [Nager.Date](https://date.nager.at/) for public holidays
