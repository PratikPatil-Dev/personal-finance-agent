# Personal Finance Agent

A Telegram bot that acts as a personal finance assistant, built as a tool-calling AI agent from
scratch (no orchestration framework) on top of the Anthropic API.

## What it does

- Log, query, update, and delete transactions via natural conversation
- Extract and log transactions from receipt/bill photos (including multiple photos sent together)
- Remember goals, budgets, preferences, habits, and other personal context across conversations
- Track progress against stated budgets/goals by reasoning over stored memories and live
  transaction data (no separate budgets database - see `src/agent/prompts.ts`)
- Durable semantic memory via [Supermemory](https://supermemory.ai), layered on top of local
  MongoDB-backed conversation history and structured memories

## Architecture

```
Telegram --> src/bot/index.ts (Telegraf)
         --> src/agent/index.ts (runAgent: builds context, calls Claude, runs the tool-use loop)
         --> src/agent/toolExecutor.ts (dispatches tool calls, zod-validates input)
         --> src/services/* (Mongoose CRUD against MongoDB)
```

Tool schemas live in `src/tools/*.anthropic.tools.ts` as zod schemas - the Anthropic
`input_schema` is generated from them via `z.toJSONSchema()`, and the same schemas validate
tool input at runtime in `toolExecutor.ts`.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the values (see comments in that file for where each
   one comes from and how it's used).
3. Generate a Telegram webhook secret and put it in `TELEGRAM_WEBHOOK_SECRET`:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Start a local tunnel (e.g. `ngrok http 8888`) and set `BASE_URL` to its HTTPS URL.
5. `npm run set-webhook` to register the webhook with Telegram (includes the secret token).
6. `npm run dev` to start the server.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the server with hot reload |
| `npm run start` | Start the server (production mode) |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run set-webhook` | Register/refresh the Telegram webhook (with secret token) |
| `npm run add-test-data` | Seed dummy conversations/memories for a fixed test user |
| `npx tsx src/scripts/triggerAgent.ts` | Manually trigger `runAgent` for the seeded test user, without Telegram |
| `npx tsx src/scripts/listAnthropicModels.ts` | List available Anthropic models |

## Notes

- `src/tools/transaction.tools.ts` and `src/tools/memory.tools.ts` (OpenAI-style function-calling
  schemas) and the `openai` dependency are currently unused by the running app - they're kept
  intentionally as scaffolding for a future multi-provider (Anthropic/OpenAI/Gemini) switch.
- The Telegram webhook endpoint (`POST /webhook/telegram`) verifies the
  `X-Telegram-Bot-Api-Secret-Token` header against `TELEGRAM_WEBHOOK_SECRET` before processing any
  update. If you rotate the secret, update `.env` and re-run `npm run set-webhook`.
