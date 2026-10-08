# Global Data Explorer

## Overview

Global Data Explorer is an interactive web application that lets users compare real-world economic and social data between two countries over a selected period of time.

The app uses data from the World Bank API and displays the results in an interactive chart. It also calculates summary statistics so users can understand how the selected indicator changed over time.

## How to Use the App

1. Click the choosen first country.
2. Choose the second country.
3. Select an indicator.
4. Enter a start year.
5. Enter an end year.
6. Click Analyze Data.
7. The app will show you the graph and summary statistics for both countries.

## Indicators

The app currently supports:

- Life Expectancy
- GDP per Capita
- Population
- Unemployment Rate
- CO₂ Emissions per Capita

## Features

- Compare two countries side by side
- Choose a custom year range
- Retrieve live data from the World Bank API
-  Chart.js line graph that's interactive
- Latest value
- Earliest value
- Average
- Minimum
- Maximum
- Range
- Percent change

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- Chart.js
- World Bank API
- GitHub
- Render

## How the App Works

The frontend is made up of HTML, CSS, and JavaScript.

When the user chooses two countries, one indicator, and a year range, JavaScript sends that data to the Flask API using `fetch()`.

Flask backend makes requests to the World Bank API, cleans the data, and computes summary statistics like average, min, max, range, and percent change.

The data is returned by the backend in JSON format.

The frontend gets the JSON data and changes the Chart.js chart and statistic cards accordingly.

The general flow is:

Frontenf → Flask backend → World Bank API → Flask data analysis → JSON response → Chart.js visualization

API KEYS:

This project uses the public World Bank API.
The World Bank API doesn't require an API key for the public indicator data that is used in this project, so there aren't any API keys or secret credentials stored in this repository.

ERRORS:

The app checks for several common errors while running, 
-start year later than end year
-invalid year range
-missing years
-missing data
-API connection problems

The app shows a user friendly error message instead of crashing.

FEATURES I AM PROUD OF:
A thing I am most proud of in this project is the connection of the frontend, backend, and World Bank API.
The application is not just presenting the raw data. The data is processed and statistics are calculated on the Flask backend, and then returned to the frontend.
The user interface was also one of the things I paid attention to as I used graph, statistic cards, loading messages, and good error handling.

AI USAGE: 
ChatGPT was used on the browser for getting some project ideas that could suit my ideas the best. However, for the actual coding part, I had used Codex AI on VS Code. All my brainstorming and everything else was done on ChatGPT, and I sort of had discussed many ideas and combined some of them before finally going ahead with the idea of Global Data Explorer. I had many issues with Github desktop, and others like that, and I had gone to chatGPT for fixing them.

DATA ANALYSIS:
(latest value - earliest value) / earliest value × 100 <------percent change calculation

DATA SOURCE:
World Bank Open Data
The application gets public indicator data from the World Bank API.

## Running the Project Locally

First install the required packages:

```bash
pip install -r requirements.txt






