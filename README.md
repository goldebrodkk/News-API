# Jake's News API 

## Overview 

Jake's News API is a back-end project built on the Northcoders full-stack development bootcamp. The project consists of a Node.js and Express server making requests to a PSQL database populated with sample data in a news/blog format.

The hosted version of this project can be found [here](https://jakes-news-api.herokuapp.com/api) 

I have also built a front-end application that uses this API as the source of it's data, the links to both the hosted version and the repo on GitHub can be found below. 

[GitHub repo](https://github.com/goldebrodkk/jakes-news-app)
[Hosted version](https://jakes-news.netlify.app/)



## Environmental Variables 

In order to run this project locally you must create two files .env.development and .env.test; 
These files should set the value of PGDATABASE to nc_news in the development file, and nc_news_test in the test file. 
This process will allow you to change which database the project uses depending on whether you are running tests, 
please ensure that the dotenv package is installed, and if it is not please run npm install dotenv.  
