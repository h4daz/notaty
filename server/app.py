import json
import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLIENT_DIR = os.path.join(BASE_DIR, "client")
DATA_FILE = os.path.join(BASE_DIR, "server", "data.json")

# Serve static files (CSS + JS)
app.mount("/client", StaticFiles(directory=CLIENT_DIR), name="client")


class Item(BaseModel):
    type: str
    item: str


# Serve frontend
@app.get("/")
def root():
    return FileResponse(os.path.join(CLIENT_DIR, "index.html"))


# Get stored data
@app.get("/get_data")
def get_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"notes": [], "todos": []}


# Save new data
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


# Run server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)