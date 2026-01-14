import sys
import os
import requests
from datetime import datetime

# Adjust path to allow imports from crawler root
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata
parent_parent = os.path.dirname(parent) # selenium
parent_parent_parent = os.path.dirname(parent_parent) # crawler

# adding the parent directory to
# the sys.path.
sys.path.append(parent_parent_parent)

from db.client import connect_to_database
from update_k_position import update_k_position
from download_image import download_image
from crud import data_map
from crud import select
from crud import update
from crud import insert

# STORES table columns
stores_columns = [
    'name',
    'country',
    'type',
    'main_category',
    'second_category',
    'third_category',
    'unit_price',
    'k_id',
    'k_position',
    'k_revenue',
    'k_revenue_history',
    'k_revenue_growth_rate',
    'k_sales',
    'updated_at'
]

def main(formated_data):
    print('')
    print('[ SELENIUM ] Saving Top Stores to DB...')

    conn = connect_to_database()
    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    try:
        cursor = conn.cursor()
        
        for item in formated_data:
            k_id = item.get('k_id')
            if not k_id:
                continue

            # STEP 01
            # If there is another product with the same 'k_position' it will be changed to NULL
            update_k_position(cursor, item)

            # STEP 02
            # Check the "stores" table for existing k_id
            store_id = None
            select_store = select(cursor, k_id)
            
            # Common data for both tables
            data_map = data_map()
            
            stores_values = [data_map[col] for col in stores_columns]

            if select_store:
                update(cursor, select_store, stores_columns, stores_values)
            
            else:
                store_id = insert(cursor, stores_columns, stores_values)

            download_image(store_id, k_id)

        conn.commit()
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        error(e)
        sys.exit(1)
        # return False

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True

if __name__ == "__main__":
    main()