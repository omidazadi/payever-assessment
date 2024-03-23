## Description

Test project with NestJS, MongoDB, and RabbitMQ. Contains thorough end-to-end, integration, and unit tests on Jest test suite.

## Prerequisites

Service requires MongoDB and RabbitMQ to operate. You have to either provide these services, or use the command below to build a containerized version of them in your local machine:

```bash
docker compose up
```

Then provide the following environment variables for the service. You can store them in a `.env`-style file.

| Variable                        | Description                                            | Default           |
| ------------------------------- | ------------------------------------------------------ | ----------------- |
| APP_PORT                        | The port application listens to.                       | 3000              |
| MAIL_SMTP_SERVER_DOMAIN         | SMTP server domain name to connect.                    | gmail.com         |
| MAIL_SMTP_SERVER_PORT           | SMTP server port to connect.                           | 25                |
| MAIL_SERVICE_ADDRESS            | Service's email address.                               | service@gmail.com |
| MAIL_ADMIN_ADDRESS              | Service admin's email address.                         | admin@gmail.com   |
| MONGO_ROOT_USERNAME             | MongoDB root username.                                 | root              |
| MONGO_ROOT_PASSWORD             | MongoDB root password.                                 |                   |
| MONGO_HOST                      | MongoDB host.                                          | localhost         |
| MONGO_PORT                      | MongoDB port.                                          | 27017             |
| MONGO_DATABASE                  | Service's database name.                               | payever           |
| RMQ_HOST                        | RabbitMQ host.                                         | localhost         |
| RMQ_PORT                        | RabbitMQ port.                                         | 5672              |
| FILE_SYSTEM_AVATAR_STORAGE_PATH | Directory name in file systemto store fetched avatars. | avatar            |
| REQRES_BASE_URL                 | Base URL for reqres website                            | https://resres.in |
| MOCKSERVER_PORT                 | Mockserver port (only used in integration tests).      | 10001             |

## Install Dependencies

To install required packages:

```bash
npm install
```

## Run

To start the service:

```bash
npm run start
```

## Test

Code includes three test packages

### End-to-End Test

Provide `test/e2e/.env.e2e` file with environment variables that the service is going to use in end-to-end tests. Then run the following:

```bash
npm run test:e2e
```

### Integration Test

Provide `test/e2e/.env.integration` file with environment variables that the service is going to use in integration tests. Note that in integration tests, not all of modules and APIs are going to be used simultaneously, so each integration test suite only uses the environment variables that are relevent to it. Run the following command to run integration tests:

```bash
npm run test:inte
```

### Unit Test

To run unit tests, use the command below:

```bash
npm run test:unit
```