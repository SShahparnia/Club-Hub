# Instructions for Backend

1. **Open terminal**  
   Either from your PC or VSCode

2. **Ensure you are in the backend directory**  
   Navigate to the backend directory (it should be something like `\Club-Hub\backend`).

3. **Install any new packages**  
   Run `npm install` to ensure all dependencies are up to date.

4. **Start the backend server**  
   Run `npm start`. You should see a console log message saying:  
   `"Connected to backend!"`

5. **Test the backend server**  
   Open your browser and go to `localhost:8800`. The root page ("/" route) should load, displaying the message:  
   `"Hello! You are connected to the backend!"`

6. **To Connect with MySQL Using .env**  
   Create a .env file (this is only for you, it will be ignore when push to remote repo)
   .env should have the following:
      DB_HOST= localhost
      DB_USER= root
      DB_PASSWORD= 'your actual password for MySQL'
      DB_NAME= 'the actual database name when you create'
   Now when you do npm start, you should see a console log said 'DB Connection are good!, if not it will say 'DB Connection error!'
