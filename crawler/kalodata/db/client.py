import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def connect_to_database():
    try:
        conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST", "localhost"),
            database=os.getenv("POSTGRES_DB", "postgres"),
            user=os.getenv("POSTGRES_USER", "postgres"),
            password=os.getenv("POSTGRES_PASSWORD", "mysecretpassword"),
            port=os.getenv("POSTGRES_PORT", "5431")
        )
        return conn
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error while connecting to PostgreSQL: {error}")
        return None