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

def update_stores_db(formated_data):
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

            # Prepare k_position value
            refined_k_position = 0 if item.get('k_position') == 'index' else item.get('k_position')

            # Check for conflict: specific position already taken by ANOTHER store
            if refined_k_position is not None:
                cursor.execute("SELECT id, k_id FROM stores WHERE k_position = %s", (refined_k_position,))
                conflict = cursor.fetchone()
                if conflict:
                    conflict_id, conflict_k_id = conflict
                    # If the occupant is NOT the current store we are processing
                    if str(conflict_k_id) != str(k_id):
                        cursor.execute("UPDATE stores SET k_position = NULL WHERE id = %s", (conflict_id,))

            # FIRST: Check the "stores" table for existing k_id
            cursor.execute("SELECT id FROM stores WHERE k_id = %s", (k_id,))
            existing_store = cursor.fetchone()
            store_id = None
            
            # Common data for both tables
            data_map = {
                'k_id': item.get('k_id'),
                'country': "br",
                'k_position': refined_k_position,
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
            
            # STORES table columns
            stores_columns = [
                'k_id',
                'country',
                'k_position',
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
                update_values = stores_values[1:] + [store_id]
                
                sql = f"UPDATE stores SET {set_clause} WHERE id = %s"
                cursor.execute(sql, update_values)

                print('')
                print(f'Updating store {store_id}...')
                print('sql: ', sql)
                print('update_values: ', update_values)
                print('')
            
            else:
                # Insert
                placeholders = ", ".join(["%s"] * len(stores_columns))
                col_names = ", ".join(stores_columns)
                
                sql = f"INSERT INTO stores ({col_names}) VALUES ({placeholders}) RETURNING id"
                cursor.execute(sql, stores_values)
                store_id = cursor.fetchone()[0]

                print('')
                print(f'Inserting store {store_id}...')
                print('sql: ', sql)
                print('stores_values: ', stores_values)
                print('')

            # SECOND: Download Image
            try:
                print('')
                print('[ SELENIUM ] Downloading image...')
                project_root = os.path.dirname(parent_parent_parent)
                images_dir = os.path.join(project_root, 'public', 'images', 'stores')
                if not os.path.exists(images_dir):
                    os.makedirs(images_dir)
                
                image_url = f"https://img.kalocdn.com/tiktok.seller/{k_id}/logo.png"
                image_path = os.path.join(images_dir, f"{store_id}.png")
                
                # Check if image already exists to avoid re-downloading (optional, but good practice)
                # But user requirement implies we should ensure it's there. Overwriting is safer if image changed.
                
                response = requests.get(image_url, stream=True)
                if response.status_code == 200:
                    with open(image_path, 'wb') as f:
                        for chunk in response.iter_content(1024):
                            f.write(chunk)
                    print(f'[ SELENIUM ] downloaded image for store: {store_id}')
                else:
                    print(f"[ SELENIUM ] Failed to download image for store {store_id} (k_id: {k_id}). Status: {response.status_code}")
            except Exception as e_img:
                print('')
                print('')
                print('')
                print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
                print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
                print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
                print(f"[ SELENIUM ] Error downloading image for store {store_id}: {e_img}")
                print('')
                print('')
                print('')

        conn.commit()
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

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
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True
