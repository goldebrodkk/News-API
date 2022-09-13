# Jake's News API 

## Overview 

Jake's News API is a back-end project built on the Northcoders full-stack development bootcamp. The project consists of a Node.js and Express server making requests to a PSQL database populated with sample data in a news/blog format. The project also contains a full Jest testing suite with tests for each of the endpoints and associated errors. 

The hosted version of this project can be found [here](https://jakes-news-api.herokuapp.com/api) with a list of available endpoints. 

I have also built a front-end application that uses this API as the source of it's data, the links to both the hosted version and the repo on GitHub can be found below. 

[GitHub repo](https://github.com/goldebrodkk/jakes-news-app)

[Hosted version](https://jakes-news.netlify.app/)

## Local Usage 

To run this project locally please ensure that you have an up to date version of node installed. 

Running the following [npm](https://www.npmjs.com/) command in the root directory of the project will install the necessary dependencies. 

```bash
npm install   
```

### Environmental Variables 

Running the project locally also requires that some environmental variables are set. This is so that the test database is used when running the test files and the development database is used when making external requsts. 

If it is not already installed please run the following command to load these variables using the [dotenv](https://www.npmjs.com/package/dotenv) package.

```bash
npm install dotenv --save
```

Following this please create two files: 

.env.development 

.env.test

In the development file please add the following code: 

```bash
PGDATABASE=nc_news
```

In the test file please add the following code: 

```bash
PGDATABASE=nc_news_test 
```

### Running the API 

To set up the databases locally please run: 

```bash
npm setup-dbs
```

To seed the development database please run: 

```bash
npm seed
```

To run the server locally please run: 

```bash
npm start
```

With the server now running you will be able to interact with the server and make any of the requests that the project supports. 

Thanks for taking a look at my project!