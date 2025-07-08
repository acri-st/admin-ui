# Admin UI


## Table of Contents

- [Introduction](#Introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)

## Introduction

### What is the Admin UI?

The admin UI is a web application that interfaces with the microservices that comprise the collaborative platform and the sandbox for administrators to manipulate and moderate.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.x or higher)
- **Git** 
- **Docker** Docker is mainly used for the test suite, but can also be used to deploy the project via docker compose

## Installation

1. Clone the repository:
```bash
git clone https://github.com/acri-st/admin-ui.git
# OR
git clone git@github.com:acri-st/admin-ui.git
cd admin-ui
```

## Development

## Development Mode

### Standard local development

Setup environment
```bash
make setup
```

Start the development server:
```bash
make start
```

The application will be available at `http://localhost:8100`

To clean the project and remove node_modules and other generated files, use:
```bash
make clean
```

### Production Build

Build the application for production:
```bash
make build
```
#### Docker local development 
Setup environment
```bash
make setup DEPLOY=docker
```

Start the development server:
```bash
make start DEPLOY=docker
```

Stop the development server:
```bash
make stop DEPLOY=docker
```

The application will be available at `http://localhost:8100`

To clean the project and remove node_modules and other generated files, use:
```bash
make clean DEPLOY=docker
```

### Production Build

Build the application for production:
```bash
make build
```

## Testing

To run tests, make sure the local project is running and then run the test suite:
```bash
make test
```

## Contributing

Check out the [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to contribute.