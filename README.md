
## Description

Type: Code challenge for G2i (NodeJS test)

Developer: Ivaylo Panitchkov <ivaylo.panitchkov@gmail.com>

## Task

Build a REST API for the **World Texting Foundation**, also known as **WTF**.

A sample JSON data file will be provided with a base set of acronym definitions. 

We expect you to create a NodeJS server using modern best practices for API development.

## Requirements

These endpoints should be created:

- **`GET /acronym?from=50&limit=10&search=:search`**
  - ▶ returns a list of acronyms, paginated using query parameters
  - ▶ response headers indicate if there are more results
  - ▶ returns all acronyms that fuzzy match against `:search`
- **`GET /acronym/:acronym`**
  - ▶ returns the acronym and definition matching `:acronym`
- **`GET /random/:count?`**
  - ▶ returns `:count` random acronyms
  - ▶ the acronyms returned should not be adjacent rows from the data
- **`POST /acronym`**
  - ▶ receives an acronym and definition strings
  - ▶ adds the acronym definition to the db
- **`PUT /acronym/:acronym`**
  - ▶ receives an acronym and definition strings
  - ▶ uses an authorization header to ensure acronyms are protected
  - ▶ updates the acronym definition to the db for `:acronym`
- **`DELETE /acronym/:acronym`**
  - ▶ deletes `:acronym`
  - ▶ uses an authorization header to ensure acronyms are protected


## Installation

```bash
$ npm install
```

## Attachments

There are three files into the `data` folder:
1. data.json - holding the test data that will be loaded into MongoDB
2. g2i.postman_collection - A Postman collection created to test all routes / cases
3. stack.yml - a docker compose file that will build and run a MongoDB instance and an admin panel

## Prerequisites

1. Launch a MongoDB instance
```bash
# From inside the `data` folder execute the following to build and run the needed database
docker-compose -f stack.yml up -d
```
2. Import the test data into MongoDB 
```bash
# Run the following command from inside the `data` folder to import the test data. You could do the same by using the Postman collection where a similar call could be performed.
curl -v -X POST -H "Content-type: application/json" --data-binary @data.json http://localhost:3000/api/v1/acronym/import
```
## Configuration

There is a `config.json` file into the project's root folder that holds needed configuration parameters

## Running the app

Once you run the application it will start accepting requests on port 3000. Check the logs for available routes. 

You could use the Postman collection to deal with the system easily.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug
```

## Playground

The backend is written in TypeScript by using the [Nest.js](https://github.com/nestjs/nest) framework.

If you don't have a MongoDB management tool you could use the one that is configured by the docker compose script. The tool could be accessed at http://localhost:8081/

All endpoints are created as specified into the requirements.

For the `GET /acronym?from=50&limit=10&search=:search` route - the name of the response header indicating if there are more results is `X-Has-More-Acronyms`.

For both `PUT /acronym/:acronym` and `DELETE /acronym/:acronym` routes - the name of the authorization header is `Secret`. The accepted value is `Th3sECr3tKeI123` (configurable into the `config.json` file).

## Missing

- Tests
