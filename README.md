## Description

Test project with NestJS, MongoDB, and RabbitMQ. Contains end-to-end tests on Jest test suite.

## Prerequisite

This service requires MongoDB and RabbitMQ to operate. You have to either provide these services, or use the command below to build a containerized version of them in your local machine:

```bash
docker compose up
```

Then provide the following environment variables for the service. You can store them in a `.env`-style file.

| Variable                  | Description                         |
| ------------------------- | ----------------------------------- |
| MAILER_SMTP_SERVER_DOMAIN | SMTP server domain name to connect. |
| MAILER_SMTP_SERVER_PORT   | SMTP server port to connect.        |
| MAILER_SERVICE_ADDRESS    | Service's email address.            |
| MAILER_ADMIN_ADDRESS      | Service admin's email address.      |
| MONGO_ROOT_USERNAME       | MongoDB root username.              |
| MONGO_ROOT_PASSWORD       | MongoDB root password.              |
| MONGO_HOST                | MongoDB host.                       |
| MONGO_PORT                | MongoDB port.                       |
| MONGO_DATABASE            | Service's database name.            |
| RMQ_HOST                  | RabbitMQ host.                      |
| RMQ_PORT                  | RabbitMQ port.                      |

An example of a testing `.env` file can be as following:

```
MAILER_SMTP_SERVER_DOMAIN=smtp.freesmtpservers.com
MAILER_SMTP_SERVER_PORT=25
MAILER_SERVICE_ADDRESS=service@payever.com
MAILER_ADMIN_ADDRESS=testing@payever.com
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=abcdef
MONGO_HOST=localhost
MONGO_PORT=27018
MONGO_DATABASE=payever
RMQ_HOST=localhost
RMQ_PORT=5672
```

## Build

```bash
npm install
```

## Run

```bash
npm run start
```

## Test

```bash
npm run test
```