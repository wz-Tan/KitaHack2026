NomNom is a project targeting SDG Goal 12 - Responsible Consumption for Kitahack 2026. 
It implements NextJS and TailwindCSS for the Frontend, with Gemini API, Flask, Numpy and Firebase for the backend.

This project aims to turn business records CSVs into actual actionable insights, particularly in analysing and predicting food sales and ingredient usage.

To run the project, first git clone the url into your destination.
Set up an env file based on the sample given. 
Then cd into nomnom and run "npm run dev" to boot up the frontend. 
Make another terminal and cd into nomnom/backend and run "python server.py" for the Flask backend. 

You can start using the application!
Import CSV File to update your Firestore Database.
Go into dashboard, pick a date and the respective filters to visualise the usage / sales of menu items and ingreidents over time!

Go into insights and wait for the AI to generate actionable advice to reduce food waste and improve sustainability!

Challenges Faced: Mapping insights onto Front-End, Figuring out best methods to store data for future referencing. 
Future Steps: Integrate with third party food apps for real time feedback for restaurant owners and optimise AI insights by caching queries and results.
