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
from logger.error import error

def request_all_top_stores_from_db(limit=10, offset=0):
    print('')
    print('[ SELENIUM ] Requesting all top stores...')

    conn = connect_to_database()

    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    result = None

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT k_id FROM stores WHERE k_position IS NOT NULL ORDER BY k_position ASC LIMIT %s OFFSET %s", (limit, offset))
        result = cursor.fetchall()
    except Exception as e:
        error(e)
        sys.exit(1)
        if conn:
            conn.rollback()
        return False

    finally:
        if conn:
            # print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return result
