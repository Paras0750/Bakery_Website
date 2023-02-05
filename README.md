# Bakery Website
This Project is created using Node.js, MongoDB, Express, and EJS.

## Prerequisites
Before you get started, you'll need to make sure you have the following software installed on your system:
- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

## Set Up the Environment
1. Open the project in your code editor.
2. Create a new file in the project root directory and name it `.env`.
3. In the `.env` file, paste the following:

SESSION_SECRET="myTopSecret"
MONGO_URI="mongodb://0.0.0.0:27017/bakeryDB"

## Install Dependencies
1. Open the terminal and navigate to the project directory.
2. Run the following command to install the dependencies:

> npm install


## Start MongoDB Server
1. In the terminal, run the following command to start the MongoDB server:

> mongod


## Add Sellingitems Collection
1. In your MongoDB, create a new database named `bakeryDB`.
2. Create a new collection named `sellingitems` and add the `sellingitems.csv` file to the collection.

## Start the Project
1. In the terminal, run the following command to start the project:
> npm start


## Get Your Ovens Ready
That's it! You should now be able to access the Bakery Website at `http://localhost:3000/`. You'll be greeted with a beautiful interface where you can view the menu and place orders for your favorite baked goods. 

Please note that this project is not fully completed. The payment system has not yet been integrated and in some parts, the user interface may not be up to par. This project was adopted from a friend and the backend was integrated to it. However, this project is open for contributions, and we welcome any efforts to improve the user experience and functionality. 

Remember, to make sure your website stands out and attracts customers, don't forget to be creative with your offerings and add a personal touch to the website. Happy baking!
