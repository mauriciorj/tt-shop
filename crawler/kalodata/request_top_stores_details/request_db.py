import sys

from db.client import connect_to_database
from logger.error import error

def request_db(limit=10, offset=0):
    print('')
    print('[ SELENIUM ] Requesting all top stores...')

    conn = connect_to_database()

    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    result = None

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, k_id FROM stores ORDER BY k_revenue DESC LIMIT %s OFFSET %s", (limit, offset))
        result = cursor.fetchall()
    except Exception as e:
        if conn:
            conn.rollback()
        error(e, 9)
        sys.exit(1)
        return False

    finally:
        if conn:
            conn.close()
        return result
