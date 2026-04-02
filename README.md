## NomNom - Reducing Food Waste, One Bite at a Time

### What is NomNom? 
NomNom is a project targeting SDG Goal 12 - Responsible Consumption for Kitahack 2026. 
This project aims to turn business records CSVs into actual actionable insights, particularly in analysing and predicting food sales and ingredient usage.

### Tech Stack
NextJS + TailwindCSS - Front End
<br>
Numpy, Gemini API - AI Assistance for Analytics
<br>
Flask, Firebase - Backend

### How to Run
```git clone```
Then set up env file. 

Initialising
```
cd nomnom
npm i
```

Start Up Front End 
```
npm run dev
```

Backend 
```
cd nomnom/backend
python server.py
```


You can start using the application!
Import CSV File to update your Firestore Database.
Go into dashboard, pick a date and the respective filters to visualise the usage / sales of menu items and ingreidents over time!

Go into insights and wait for the AI to generate actionable advice to reduce food waste and improve sustainability!

Challenges Faced: Mapping insights onto Front-End, Figuring out best methods to store data for future referencing. 
Future Steps: Integrate with third party food apps for real time feedback for restaurant owners and optimise AI insights by caching queries and results.
