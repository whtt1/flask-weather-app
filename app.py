from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

API_KEY = "7afd54e6bab22283567719f6caf3cb64"
BASE_URL = "https://api.openweathermap.org/data/2.5/"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/weather")
def weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City required"}), 400

    url = f"{BASE_URL}weather?q={city}&appid={API_KEY}&units=metric"
    try:
        res = requests.get(url)
        data = res.json()
        if res.status_code != 200:
            return jsonify(data), res.status_code
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route("/forecast")
def forecast():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City required"}), 400

    url = f"{BASE_URL}forecast?q={city}&appid={API_KEY}&units=metric"
    try:
        res = requests.get(url)
        data = res.json()
        if res.status_code != 200:
            return jsonify(data), res.status_code
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
