import sys
import os

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))

# Getting the parent directory name
# where the current directory is present.
parent = os.path.dirname(current)
parent_parent = os.path.dirname(parent)
parent_parent_parent = os.path.dirname(parent_parent)

# adding the parent directory to
# the sys.path.
sys.path.append(parent_parent_parent)

from db.client import connect_to_database

def request_all_top_products_from_db(limit=10, offset=0):
    # print('')
    # print('[ SELENIUM ] Requesting all top products...')

    conn = connect_to_database()

    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    result = None

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT k_id FROM products ORDER BY k_revenue DESC LIMIT %s OFFSET %s", (limit, offset))
        result = cursor.fetchall()
    except Exception as e:
        print('')
        print('')
        print('')
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(f"[ SELENIUM ] Error saving to DB: {e}")
        print('')
        print('')
        print('')
        if conn:
            conn.rollback()
        return False

    finally:
        if conn:
            # print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return result
