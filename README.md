# Interactive Sync EBS

![Build and deploy - interactive-sync-ebs](https://github.com/jmcartlamy/interactive-sync-ebs/workflows/Build%20and%20deploy%20-%20interactive-sync-ebs/badge.svg)

A Twitch extension connected to the [Twitch API](https://dev.twitch.tv/docs/api) allowing to a viewer to perform chosen actions by developers to use them in twitch plays experiences.

## Extensions Backend Service

### Setting environment variables

Create a `.env` file with this template:

```
EXT_CLIENT_ID=YOUR_CLIENT_ID
EXT_CLIENT_SECRET=YOUR_CLIENT_SECRET
EXT_SHARED_SECRET=YOUR_SHARED_SECRET
EXT_OWNER_ID=YOUR_OWNER_ID
```

### Running the EBS

EBS (Extensions Backend Service) must be run and hosted separately.

As you set environment variables, open a new terminal, install dependencies and run `yarn start` to start the node server.

## Available Commands

| Command | Description |
|---------|-------------|
| `yarn install` | Install back-end dependencies |
| `yarn start` | Run extensions backend service |

