import sys
from datetime import datetime

from logger.error import error
from db.client import connect_to_database

# STORE table columns
store_columns = [
    'k_top_creators',
    'k_top_products',
    'k_top_videos',
    'k_day_sales',
    'k_day_revenue',
]

def postgres(data_map):
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
        error(e, 10)
        sys.exit(1)

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True
