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

def update_stores_db_from_store_details(k_id, result_request_top_creators_dto, result_request_top_products_from_store_details_dto, result_request_top_videos_dto, result_request_store_total_sales_dto):
    print('')
    print('[ SELENIUM ] Saving Infos to Store in DB...')

    conn = connect_to_database()
    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    try:
        cursor = conn.cursor()
        
        k_id = item.get('k_id')
        if not k_id:
            continue

        # FIRST: Check the "stores" table for existing k_id
        cursor.execute("SELECT id FROM stores WHERE k_id = %s", (k_id,))
        existing_store = cursor.fetchone()
        store_id = None

        # Mapping top_creators
        top_creators = [str(item['k_id']) for item in result_request_top_creators_dto if 'k_id' in item]
        top_products = [str(item['k_id']) for item in result_request_top_products_from_store_details_dto if 'k_id' in item]
        top_videos = [str(item['k_id']) for item in result_request_top_videos_dto if 'k_id' in item]
        day_sales, day_revenue = result_request_store_total_sales_dto
            
        # Common data for both tables
        data_map = {
            'top_creators': top_creators,
            'top_products': top_products,
            'top_videos': top_videos,
            'day_sales': day_sales,
            'day_revenue': day_revenue,
        }
            
        # STORE table columns
        store_columns = [
            'top_creators',
            'top_products',
            'top_videos',
            'day_sales',
            'day_revenue',
        ]
        
        store_values = [data_map[col] for col in store_columns]

        if existing_store:
            store_id = existing_store[0]
            # Update
            # Construct SET clause
            set_clause = ", ".join([f"{col} = %s" for col in store_columns if col != 'k_id'])
            
            # Values for update (exclude k_id from set values, but need it for WHERE)
            # store_values has k_id at index 0 (based on store_columns order)
            update_values = store_values[1:] + [k_id]
            
            sql = f"UPDATE stores SET {set_clause} WHERE k_id = %s"
            cursor.execute(sql, update_values)
            
        else:
            print(f"[ SELENIUM ] Store not found in DB: {k_id}")

        conn.commit()
        print('')
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        print(f"[ SELENIUM ] Error saving to DB: {e}")
        if conn:
            conn.rollback()
        return False

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True
