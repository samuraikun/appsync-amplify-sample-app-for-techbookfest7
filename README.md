# About this repository

- 技術書典7で出典した「AppSync & Amplify によるサーバーレス開発入門」内で題材となるアプリケーションです。

# Setup
- React v16.9.0
- Node.js v10.16.0

```bash
npm i -g @aws-amplify/cli

yarn install

// If you signed up AWS console
amplify init

// use Cognito
amplify add auth

// select GraphQL API
amplify add api

yarn start
```
