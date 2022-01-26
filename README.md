# Interactive Sync EBS

![Build and test - interactive-sync-ebs](https://github.com/jmcartlamy/interactive-sync-ebs/workflows/Build%20and%20test%20-%20interactive-sync-ebs/badge.svg)

An Extension Backend Service that supports the front side of the [Interactive Sync](https://github.com/jmcartlamy/interactive-sync-front), connected to the [Twitch API](https://dev.twitch.tv/docs/api) allowing to a viewer to perform chosen actions by developers to use them in Twitch Plays Experiences.

See the [Interactive Sync documentation](https://www.interactive-sync.com/docs) for more details!

## Extensions Backend Service

### Register your server

Connect on [Twitch Developers](https://dev.twitch.tv/console/extensions) and register an extension to use ID / Twitch API if you don't have one. Else, go directly to step 4.

1. Choose your name and click on "Continue",
2. Select these Extension Types: "Panel", "Video Fullscreen" and "Mobile",
3. After fill the inputs and create the extension version, click on the button "Extension Settings",
4. Note the **Client ID** of your (new) extension,
5. On Twitch API Client Secret, generate a new **Client Secret**,
6. On Extension Client Configuration, get an **Extension Secret**,
7. Save your **Client ID / Secret** and **Extension Secret** for the environment variables

### Setting environment variables

Clone the repository on the local folder which will contain your front-end code / the EBS, and install dependencies with `yarn install`.

Create a `.env` file with this template:

```
EXT_CLIENT_ID=YOUR_CLIENT_ID
EXT_CLIENT_SECRET=YOUR_CLIENT_SECRET
EXT_SHARED_SECRET=YOUR_SHARED_SECRET
EXT_HOST=YOUR_HOST
EXT_BLACKLIST_URI=YOUR_BLACKLIST_URI
```

`EXT_HOST` must follow this structure - `//YOUR_HOST/` - and is to be defined when you deploy the server on the web.

### Running the EBS

EBS (Extensions Backend Service) must be run and hosted separately.

As you set environment variables, run `yarn start` to start the node server.

## Available Commands

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `yarn install`    | Install back-end dependencies  |
| `yarn start`      | Run extensions backend service |
| `yarn start:prod` | Run EBS in the production mode |
| `yarn test`       | Run tests                      |
