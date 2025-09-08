# BugDo - QA Engineer interview assessment

This is a little demo todo app used to assess candidate QA Engineers.

See the accompanying [Confluence page](https://podfather.atlassian.net/wiki/spaces/ENG/pages/3803283457/QA+technical+assessment).

## Instructions for interview

We will use Stackblitz to send the app to the candidate.

* Find the Stackblitz project, or create from Github repository
* Double check that Stackblitz automatically runs `npm i` and `npm run dev`, and the application shows in the Preview panel
  * If the Preview shows "Cannot GET /" it's probably navigated to port 3000 (the backend Node server) rather than port 5173 (the Vite dev server for the frontend)
* Use the Share menu to get a link for the candidate. **Set the "Default file to show" as: INSTRUCTIONS.md**
* Invite the candidate to open the link, and confirm that they can see the application running in the Preview panel
* Invite them to read the INSTRUCTIONS.md document, then use the button in the top right: "Open Preview in new tab"
  * They are able to open multiple tabs, close and reopen, etc. as long as their Stackblitz page stays open

## Development

1. Install dependencies. You can use npm or pnpm:
   ```bash
   npm i
   ```
   or
   ```bash
   pnpm i
   ```
2. Start the development server:
   ```bash
   pnpm dev
   ```
   or
   ```bash
   npm run dev
   ```
   This uses `concurently` to run both Vite for the frontend (port 5173) and Node/Express backend (port 3000).

## Technical details

- **Frontend**: Vue 3, TypeScript, Vue Router, Tailwind, Vite
- **Backend**: Express.js, JWT authentication, in-memory mock database

### Routes

- `/login` (redirects from `/`) - Login page
- `/todos` - Todo list page (requires authentication)
- `/admin` - Admin panel for user management (theoretically requires admin role, but this is one of our bugs)
