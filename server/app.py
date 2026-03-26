from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "data.json"

# Opprett fil hvis den ikke finnes
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({"notes": [], "todos": []}, f)


def load_data():
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)


# -------------------------
# GET: Hent alt
# -------------------------
@app.route("/api/data", methods=["GET"])
def get_data():
    data = load_data()
    return jsonify(data)


# -------------------------
# POST: Lag tekstnotat
# -------------------------
@app.route("/api/notes", methods=["POST"])
def create_note():
    data = load_data()
    new_note = request.json

    data["notes"].append(new_note)
    save_data(data)

    return jsonify({"message": "Notat lagret!"})


# -------------------------
# POST: Lag todo-liste
# -------------------------
@app.route("/api/todos", methods=["POST"])
def create_todo():
    data = load_data()
    new_todo = request.json

    data["todos"].append(new_todo)
    save_data(data)

    return jsonify({"message": "Todo lagret!"})


if __name__ == "__main__":
    app.run(debug=True)