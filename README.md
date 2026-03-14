# Anime Character Website

Simple app to create and display user-defined anime characters.

## Setup

1. Copy `.env.example` to `.env`.
2. Set Alibaba Cloud OSS credentials and endpoint.
3. Run `npm install` (already done).
4. Start app:
   ```bash
   node server.js
   ```
5. Open `http://localhost:3000`.

## Features

- Create anime character cards with avatar upload
- Store metadata in SQLite (`data.db`)
- Upload avatar to Alibaba Cloud OSS
- Front page shows example character cards
