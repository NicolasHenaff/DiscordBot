# DiscordBot
A discord bot in typescript for rolling dices

## Deployment

### Node

***Node >16.9.0 is required***

Install the required dependencies

```bash
npm install
```

Then launch it, either in the foregorund...

```bash
npm start
```
...or in the background using a tool like [PM2](https://pm2.keymetrics.io/)

```bash
npm run build
pm2 start "node /path/to/project/dist" --name dice-bot
```

### Docker

Build the Docker image locally

```bash
docker build . --tag dice-bot
```

Then run a container

```bash
docker run -d --name dice-bot-1 -e DISCORD_TOKEN="your_discord_token" -e CLIENT_ID="your_client_id" dice-bot
```
