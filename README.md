# Cipta Graha Mandiri App

Cipta Graha Mandiri App or CGM App is a web application for Cipta Graha Mandiri residential. it used for check monthly fee for every resident and managed by administrator.

## Getting Started

### Requirements :

> [!NOTE]
> The current version needs manual software installation.

- Node JS v22.11.0 or higher
- NPM v10.9.0 or higher
- PostgreSQL 17

## Installation

First, Clone [github repository](https://github.com/mutaqinmi/cgm-app-admin.git) using Git

```bash
git clone https://github.com/mutaqinmi/cgm-app-admin.git && cd cgm-app-admin
```

Install the dependencies

```bash
npm i
# or
pnpm i
```

Open .env.example file and rename it to **.env** and then edit the variable with your preferences.

> [!TIP]
> .env Example
>
> `API_URL=https://your-api-url.com/api/v1` // your API url

And then, build the web app using following command

```bash
npm run build
# or
pnpm build
```

> [!IMPORTANT]
> Before continue to next step, make sure your API is active.

And finally, start your application

```bash
npm run start
# or
pnpm start
```