from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/data")
def get_data():
    country1 = request.args.get("country1")
    country2 = request.args.get("country2")
    indicator = request.args.get("indicator")
    start_year = request.args.get("start")
    end_year = request.args.get("end")

    if not country1 or not country2 or not indicator:
        return jsonify({
            "error": "Please select two countries and an indicator."
        }), 400

    try:
        start_year = int(start_year)
        end_year = int(end_year)
    except (TypeError, ValueError):
        return jsonify({
            "error": "Please enter valid years."
        }), 400

    if start_year > end_year:
        return jsonify({
            "error": "Start year cannot be after end year."
        }), 400

    if start_year < 1960 or end_year > 2026:
        return jsonify({
            "error": "Please choose years between 1960 and 2026."
        }), 400

    try:
        country1_data = fetch_country_data(
            country1,
            indicator,
            start_year,
            end_year
        )

        country2_data = fetch_country_data(
            country2,
            indicator,
            start_year,
            end_year
        )

        return jsonify({
            "country1": country1_data,
            "country2": country2_data
        })

    except requests.RequestException:
        return jsonify({
            "error": "The World Bank service could not be reached."
        }), 503

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 404

    except Exception as error:
        print("Unexpected error:", error)

        return jsonify({
            "error": "Something went wrong while loading the data."
        }), 500


def fetch_country_data(country_code, indicator, start_year, end_year):
    url = (
        f"https://api.worldbank.org/v2/country/"
        f"{country_code}/indicator/{indicator}"
    )

    params = {
        "format": "json",
        "date": f"{start_year}:{end_year}",
        "per_page": 100
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    api_data = response.json()

    if (
        not isinstance(api_data, list)
        or len(api_data) < 2
        or api_data[1] is None
    ):
        raise ValueError(
            f"No data was available for {country_code}."
        )

    cleaned_data = []
    country_name = country_code

    for item in api_data[1]:
        if item.get("value") is not None:
            country_name = item["country"]["value"]

            cleaned_data.append({
                "year": int(item["date"]),
                "value": float(item["value"])
            })

    if len(cleaned_data) == 0:
        raise ValueError(
            f"No usable data was available for {country_name}."
        )

    cleaned_data.sort(
        key=lambda item: item["year"]
    )

    values = [
        item["value"]
        for item in cleaned_data
    ]

    earliest = values[0]
    latest = values[-1]
    average = sum(values) / len(values)
    minimum = min(values)
    maximum = max(values)
    data_range = maximum - minimum

    if earliest != 0:
        percent_change = (
            (latest - earliest)
            / abs(earliest)
        ) * 100
    else:
        percent_change = 0

    return {
        "country": country_name,
        "data": cleaned_data,
        "statistics": {
            "earliest": round(earliest, 2),
            "latest": round(latest, 2),
            "average": round(average, 2),
            "minimum": round(minimum, 2),
            "maximum": round(maximum, 2),
            "range": round(data_range, 2),
            "percent_change": round(percent_change, 2)
        }
    }


if __name__ == "__main__":
    app.run(debug=True)