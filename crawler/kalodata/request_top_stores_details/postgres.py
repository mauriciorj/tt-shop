import sys
from datetime import datetime

from utils.save_error import save_error
from db.client import connect_to_database

# STORE table columns
store_columns = [
    'k_top_creators',
    'k_top_products',
    'k_top_videos',
    'k_day_sales',
    'k_day_revenue',
]

def postgres_update(data_map):
    # print('')
    print('[ SELENIUM ] Updating store in DB...')

    conn = connect_to_database()
    if conn is None:
        # print("[ SELENIUM ] Failed to connect to database.")
        return

    try:
        cursor = conn.cursor()
        
        store_values = [data_map[col] for col in store_columns]

        set_clause = ", ".join([f"{col} = %s" for col in store_columns if col != 'store_k_id'])
        update_values = store_values + [store_id]
        
        sql = f"UPDATE stores SET {set_clause} WHERE id = %s"

        cursor.execute(sql, update_values)
        conn.commit()

        print('')
        print(f"[ SELENIUM ] Processed items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        save_error(source='request_top_stores_details/postgres/01', error=e)
        sys.exit(1)

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True

def postgres_request(limit=10, offset=0):
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
        save_error(source='request_top_stores_details/postgres/02', error=e)
        sys.exit(1)
        return False

    finally:
        if conn:
            conn.close()
        return result