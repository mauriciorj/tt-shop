import sys
import os
import json
from datetime import datetime

# Adjust path to allow imports from crawler root
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata
parent_parent = os.path.dirname(parent) # selenium
parent_parent_parent = os.path.dirname(parent_parent) # crawler
sys.path.append(parent_parent_parent)

from db.client import connect_to_database

def request_top_stores_data_to_db(formated_data):
    print('')
    print('[ SELENIUM ] Saving data to DB...')

    conn = connect_to_database()
    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    try:
        cursor = conn.cursor()

        # Delete all records from top_stores table with same region
        region = formated_data[0].get('region')
        sql = 'DELETE FROM top_stores WHERE region = %s'
        cursor.execute(sql, (region,))
        conn.commit()
        
        for item in formated_data:
            k_id = item.get('k_id')
            if not k_id:
                continue

            # FIRST: Check the "stores" table for existing k_id
            cursor.execute("SELECT id FROM stores WHERE k_id = %s", (k_id,))
            existing_store = cursor.fetchone()
            store_id = None
            
            # Common data for both tables
            data_map = {
                'k_id': item.get('k_id'),
                'position': 0 if item.get('position') == 'index' else item.get('position'),
                'name': item.get('name'),
                'type': item.get('type'),
                'region': item.get('region'),
                'main_category': item.get('main_category'),
                'second_category': item.get('second_category'),
                'third_category': item.get('third_category'),
                'revenue': item.get('revenue'),
                'revenue_history': item.get('revenue_history'),
                'revenue_growth_rate': item.get('revenue_growth_rate'),
                'sales': item.get('sales'),
                'unit_price': item.get('unit_price'),
                'updated_at': datetime.now()
            }
            
            # STORES table columns (excluding position)
            stores_columns = [
                'k_id',
                'name',
                'type',
                'region',
                'main_category',
                'second_category',
                'third_category',
                'revenue',
                'revenue_history',
                'revenue_growth_rate',
                'sales',
                'unit_price',
                'updated_at'
            ]
            stores_values = [data_map[col] for col in stores_columns]

            if existing_store:
                store_id = existing_store[0]
                # Update
                # Construct SET clause
                set_clause = ", ".join([f"{col} = %s" for col in stores_columns if col != 'k_id'])
                
                # Values for update (exclude k_id from set values, but need it for WHERE)
                # stores_values has k_id at index 0 (based on stores_columns order)
                update_values = stores_values[1:] + [k_id]
                
                sql = f"UPDATE stores SET {set_clause} WHERE k_id = %s"
                cursor.execute(sql, update_values)
            
            else:
                # Insert
                placeholders = ", ".join(["%s"] * len(stores_columns))
                col_names = ", ".join(stores_columns)
                sql = f"INSERT INTO stores ({col_names}) VALUES ({placeholders}) RETURNING id"
                cursor.execute(sql, stores_values)
                store_id = cursor.fetchone()[0]

            # SECOND: Add to top_stores table
            # TOP_STORES includes position and store_id
            top_stores_columns = stores_columns + ['position', 'store_id']
            # Reconstruct values for top_stores (stores_values + position + store_id)
            # CAREFUL: stores_columns doesn't have position. existing 'stores_values' matches 'stores_columns'.
            # We need to build the list manually or append.
            top_stores_values = stores_values + [data_map['position'], store_id]
            
            # Wait, stores_columns ends with updated_at. top_stores_columns appends position, store_id.
            # So top_stores_values must match that order.
            
            placeholders = ", ".join(["%s"] * len(top_stores_columns))
            col_names = ", ".join(top_stores_columns)
            sql = f"INSERT INTO top_stores ({col_names}) VALUES ({placeholders})"
            cursor.execute(sql, top_stores_values)   

        conn.commit()
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
