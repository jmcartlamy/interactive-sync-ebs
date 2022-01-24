# Interactive Sync EBS

![Build and test - interactive-sync-ebs](https://github.com/jmcartlamy/interactive-sync-ebs/workflows/Build%20and%20test%20-%20interactive-sync-ebs/badge.svg)

An Extension Backend Service that supports the extension [Interactive Sync](https://dashboard.twitch.tv/extensions/pm37duoivrzgx7a3px339qwmfw6fbn) connected to the [Twitch API](https://dev.twitch.tv/docs/api) allowing to a viewer to perform chosen actions by developers to use them in Twitch Plays Experiences.

## Extensions Backend Service

### Register your server

Connect on [Twitch Developers](https://dev.twitch.tv/console) and register an extension to use ID / Twitch API.

1. Set a name for your extension,
2. Set the following type of extension: Panel, Vidéo - Fullscreen, Mobile,
3. Note your **Client ID**,
4. After fill the inputs and create the extension version, click on the button "Extension Settings",
5. On Twitch API Client Secret, generate a new **Client Secret**,
6. On Extension Client Configuration, get an **Extension Secret**,
7. Save your **Client ID / Secret** and **Extension Secret** for the environment variables

### Setting environment variables

Create a `.env` file with this template:

```
EXT_CLIENT_ID=YOUR_CLIENT_ID
EXT_CLIENT_SECRET=YOUR_CLIENT_SECRET
EXT_SHARED_SECRET=YOUR_SHARED_SECRET
EXT_HOST=YOUR_HOST
EXT_BLACKLIST_URI=YOUR_BLACKLIST_URI
```

### Running the EBS

EBS (Extensions Backend Service) must be run and hosted separately.

As you set environment variables, open a new terminal, install dependencies and run `yarn start` to start the node server.

## Available Commands

| Command        | Description                    |
| -------------- | ------------------------------ |
| `yarn install` | Install back-end dependencies  |
| `yarn start`   | Run extensions backend service |
| `yarn test`    | Run tests                      |
