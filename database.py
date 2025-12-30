import sqlite3
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

DB_NAME = "notes.db"


def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            note TEXT,
            summary TEXT,
            created_at TEXT
        )
    """)

    conn.commit()


def save_summary(user_id, note, summary):
    conn = get_db()

    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    conn.execute(
        "INSERT INTO summaries (user_id, note, summary, created_at) VALUES (?, ?, ?, ?)",
        (user_id, note, summary, now)
    )

    conn.commit()


def get_summaries(user_id):
    conn = get_db()

    cursor = conn.execute(
        "SELECT * FROM summaries WHERE user_id = ? ORDER BY id DESC",
        (user_id,)
    )

    return cursor.fetchall()


def get_summary_by_id(summary_id):
    conn = get_db()

    cursor = conn.execute(
        "SELECT * FROM summaries WHERE id = ?",
        (summary_id,)
    )

    return cursor.fetchone()


def delete_summary(summary_id, user_id):
    conn = get_db()

    conn.execute(
        "DELETE FROM summaries WHERE id = ? AND user_id = ?",
        (summary_id, user_id)
    )

    conn.commit()


def search_summaries(user_id, query):
    conn = get_db()

    cursor = conn.execute(
        """
        SELECT * FROM summaries
        WHERE user_id = ?
        AND (note LIKE ? OR summary LIKE ?)
        ORDER BY id DESC
        """,
        (user_id, f"%{query}%", f"%{query}%")
    )

    return cursor.fetchall()


def create_user(username, password):
    conn = get_db()

    hashed = generate_password_hash(password)

    conn.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, hashed)
    )

    conn.commit()


def get_user(username, password):
    conn = get_db()

    cursor = conn.execute(
        "SELECT * FROM users WHERE username = ?",
        (username,)
    )

    user = cursor.fetchone()

    if not user:
        return None

    if check_password_hash(user["password"], password):
        return user

    return None

def delete_all_summaries(user_id):
    conn = get_db()

    conn.execute(
        "DELETE FROM summaries WHERE user_id = ?",
        (user_id,)
    )

    conn.commit()
