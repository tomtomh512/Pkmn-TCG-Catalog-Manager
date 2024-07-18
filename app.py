from flask import Flask, request, jsonify
from datetime import datetime
import sqlite3

app = Flask(__name__)

def initialize_database():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 username TEXT NOT NULL,
                 password TEXT NOT NULL)''')

    c.execute('''CREATE TABLE IF NOT EXISTS collection
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 card_id INTEGER,
                 user_id INTEGER,
                 name TEXT NOT NULL,
                 setName TEXT NOT NULL,
                 artist TEXT NOT NULL,
                 image TEXT NOT NULL,
                 releaseDate DATE NOT NULL,
                 timeAdded DATETIME NOT NULL,
                 FOREIGN KEY (user_id) REFERENCES users(id))''')

    conn.commit()
    conn.close()

initialize_database()

@app.route('/log_in', methods=['POST'])
def log_in():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = c.fetchone()

    # if no matches
    if user is None:
        conn.close()
        return jsonify({"message": "No username found"}), 400

    # incorrect password
    stored_password = user[2]
    if (password != stored_password):
        conn.close()
        return jsonify({"message": "Incorrect password"}), 400

    user_id = user[0]

    conn.close()
    return jsonify({"message": "User log in successful", "user_id": user_id}), 200


@app.route('/sign_up', methods=['POST'])
def sign_up():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    # if username already exists
    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    if user is not None:
        conn.close()
        return jsonify({"message": "Username is already taken"}), 400

    c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
    conn.commit()
    conn.close()

    return jsonify({"message": "User added successfully"}), 200

def format_date(date_str):
    return date_str.replace('/', '-')

@app.route('/add_pkmn', methods=['POST'])
def add_pkmn():
    data = request.get_json()
    card_id = data.get('card_id')
    user_id = data.get('user_id')
    name = data.get('name')
    setName = data.get('setName')
    artist = data.get('artist')
    image = data.get('image')
    releaseDate = format_date(data.get('releaseDate'))
    timeAdded = datetime.now()

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute("""INSERT INTO collection (card_id, user_id, name, setName, artist, image, releaseDate, timeAdded)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)""", (card_id, user_id, name, setName, artist, image, releaseDate, timeAdded))
    conn.commit()
    conn.close()

    return jsonify({"message": "Pokémon added successfully"}), 200

@app.route('/get_pkmn', methods=['GET'])
def get_pkmn():
    data = request.args
    user_id = data.get('user_id')
    cardName = data.get('cardName')
    setName = data.get('setName')
    artist = data.get('artist')
    releaseDate = data.get('releaseDate')
    sortMethod = data.get('sortMethod')
    pageNumber = int(data.get('pageNumber'))

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    query = "SELECT * FROM collection WHERE user_id = ?"
    params = [user_id]

    # Search info
    if cardName:
        query += " AND name LIKE ?"
        params.append(f'%{cardName}%')
    if setName:
        query += " AND setName LIKE ?"
        params.append(f'%{setName}%')
    if artist:
        query += " AND artist LIKE ?"
        params.append(f'%{artist}%')
    if releaseDate:
        query += " AND releaseDate LIKE ?"
        params.append(f'%{releaseDate}%')

    # get totalCount
    count_query = f"SELECT COUNT(*) FROM ({query})"
    c.execute(count_query, tuple(params))
    totalCount = c.fetchone()[0]

    # Sorting
    if sortMethod == '↑ Name':
        query += " ORDER BY name ASC"
    elif sortMethod == '↓ Name':
        query += " ORDER BY name DESC"
    elif sortMethod == '↑ Date Added':
        query += " ORDER BY timeAdded ASC"
    elif sortMethod == '↓ Date Added':
        query += " ORDER BY timeAdded DESC"
    elif sortMethod == 'Oldest':
        query += " ORDER BY releaseDate ASC"
    elif sortMethod == 'Newest':
        query += " ORDER BY releaseDate DESC"

    # Page number
    offset = (pageNumber - 1) * 25
    query += f" LIMIT 25 OFFSET {offset}"

    c.execute(query, tuple(params))
    user_cards = c.fetchall()

    conn.close()

    cards = []
    for card in user_cards:

        cards.append({
            "id": card[0],
            "card_id": card[1],
            "image": card[6],
            "name": card[3],
            "setName": card[4],
            "dateAdded": card[8],
        })

    return jsonify({"cards": cards, "totalCount": totalCount}), 200

@app.route('/remove_pkmn', methods=['POST'])
def remove_pkmn():
    data = request.get_json()
    unique_card_id = data.get('unique_card_id')
    user_id = data.get('user_id')

    conn = sqlite3.connect('users.db')
    c = conn.cursor()

    c.execute("DELETE FROM collection WHERE id = ? AND user_id = ?", (unique_card_id, user_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Pokémon removed successfully"}), 200

if __name__ == '__main__':
    app.run()
