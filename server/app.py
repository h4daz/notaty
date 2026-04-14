import json
from fastapi import FastAPI
from pydantic import BaseModel
from flask import Flask, render_template


app = FastAPI()
DATA_FILE = "data.json"


class Item(BaseModel):
    type: str
    item: str


@app.get("/")
def root():
    return render_template('index.html')


@app.get("/get_data")
def get_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"notes": [], "todos": []}


@app.post("/save_data")
def save_data(data: Item):
    try:
        with open(DATA_FILE, "r") as f:
            file_data = json.load(f)
    except FileNotFoundError:
        file_data = {"notes": [], "todos": []}

    if data.type in file_data:
        file_data[data.type].append(data.item)

    with open(DATA_FILE, "w") as f:
        json.dump(file_data, f, indent=4)

    return {"status": "success"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)