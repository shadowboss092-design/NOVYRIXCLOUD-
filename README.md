# NOVYRIXCLOUD Website

Node.js + Express website with Home, Hosting Plans, Support, Status and design-preview gallery pages. Branding follows the NOVYRIXCLOUD dark navy/cyber blue/purple visual identity and configured logo.

## Run locally (Node.js 18+)

```bash
npm install
npm start
```

Then open http://localhost:3000

Preview gallery: http://localhost:3000/previews

## Ubuntu VPS install

Upload this ZIP to your server, then:

```bash
sudo apt update && sudo apt install -y nodejs npm unzip
unzip novyrixcloud-website.zip
cd novyrixcloud-website
npm install
npm start
```

Keep the terminal open while testing. For production use a process manager and a reverse proxy/domain.

## Edit brand, plans, Discord and support email

Edit `public/config.js`. The plans page reads its plan catalogue from that file automatically. The Discord invite is prefilled as `https://discord.gg/2nTjSWJXaQ`. Change `supportEmail` from the placeholder before launch.

## Important
- Minecraft plan RAM tiers (2 / 4 / 6 / 8 GB) follow the earlier hosting discussion. The prior chats did not specify confirmed prices; the displayed PKR/month prices are editable draft values. VPS specs and prices are draft catalogue values too. Verify capacity and pricing before publishing.
- Status entries are demo placeholders, not live monitoring.
- Order buttons open Discord; there is no payment, account login, automated server provisioning, or control panel integration yet.
- Do not store private credentials in client-side JavaScript. A real admin panel needs server-side authentication and a database.


## Admin panel — edit plans

Open `http://localhost:3000/admin` after starting the site. The starter login is `admin` / `admin` for local testing only. **Before putting this site online, set a strong `ADMIN_PASSWORD` and a long random `SESSION_SECRET`; do not keep the starter password on a public server.** You may also set `ADMIN_USERNAME`. Example (Linux):

```bash
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD='replace-with-a-long-unique-password'
export SESSION_SECRET="$(openssl rand -hex 32)"
npm install && npm start
```

The admin panel lets you add, edit, and delete Minecraft, VPS, and Bot Hosting plans, including price, RAM, CPU, storage, badge, and features. Saved plans persist in `data/plans.json` and the public `/plans` page reads the saved catalogue. Back up the `data/` folder. For HTTPS production deployment, keep the app behind HTTPS and set `NODE_ENV=production`.


## Customer accounts and support tickets
- Open `/auth` to register with an email and password or log in. Passwords are salted and hashed before being stored.
- Open `/tickets` to create tickets and view your own ticket history.
- Admins can open `/admin`, log in, then choose **Ticket Manager** to view tickets and set status to Open, In Progress, or Closed.
- User accounts and tickets are stored in `data/users.json` and `data/tickets.json`; plan edits remain in `data/plans.json`. Back up the `data` folder.
- This is a starter implementation. Before public launch, configure strong `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET`, use HTTPS, and configure a persistent session store/database. Do not use default admin credentials on a public server.

## Customer accounts and tickets
- `/auth`: register or log in with email/password. Passwords are salted and hashed.
- `/tickets`: create tickets and see your own ticket history.
- `/admin`: choose Ticket Manager to view tickets and update their status.
- Data files are saved in `data/users.json`, `data/tickets.json`, and `data/plans.json`. Back up `data`.
- Before public deployment, set strong `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET`, use HTTPS, and use a persistent session store/database. Do not leave default admin credentials enabled.
