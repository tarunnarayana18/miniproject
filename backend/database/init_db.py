import sqlite3
import pandas as pd
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / 'students.db'
CSV_PATH = Path(__file__).resolve().parents[1] / 'data' / 'students.csv'

def init_db():
    df = pd.read_csv(CSV_PATH)
    conn = sqlite3.connect(DB_PATH)
    df.to_sql('students', conn, if_exists='replace', index=False)
    conn.close()

if __name__ == '__main__':
    init_db()
    print('Database initialized at', DB_PATH)
