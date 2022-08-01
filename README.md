## Environmental Variables 

In order to run this project locally you must create two files .env.development and .env.test; 
These files should set the value of PGDATABASE to nc_news in the development file, and nc_news_test in the test file. 
This process will allow you to change which database the project uses depending on whether you are running tests, 
please ensure that the dotenv package is installed, and if it is not please run npm install dotenv.  
