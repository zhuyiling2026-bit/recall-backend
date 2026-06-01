# Recall Backend

Express.js API for Recall — save, organize & review web content with AI analysis.

## One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/zhuyiling2026-bit/recall-backend)

After deploying, add these environment variables in Railway:

| Variable | Description |
|----------|-------------|
| `DEEPSEEK_API_KEY` | DeepSeek API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/content/import` | Analyze URL, return preview |
| `POST` | `/content/confirm` | Save confirmed content |
| `GET` | `/content/list` | List all saved content |
| `PATCH` | `/content/:id` | Update content status |

## Local Development

```bash
cp .env.example .env  # fill in your keys
npm install
npm start
```
