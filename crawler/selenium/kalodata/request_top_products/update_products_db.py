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

def update_products_db(formated_data):
    print('')
    print('[ SELENIUM ] Saving Top Products to DB...')

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

            # Check for conflict: specific position already taken by ANOTHER product
            if refined_k_position is not None:
                cursor.execute("SELECT id, k_id FROM products WHERE k_position = %s", (refined_k_position,))
                conflict = cursor.fetchone()
                if conflict:
                    conflict_id, conflict_k_id = conflict
                    # If the occupant is NOT the current product we are processing
                    if str(conflict_k_id) != str(k_id):
                        cursor.execute("UPDATE products SET k_position = NULL WHERE id = %s", (conflict_id,))

            # FIRST: Check the "products" table for existing k_id
            cursor.execute("SELECT id FROM products WHERE k_id = %s", (k_id,))
            existing_product = cursor.fetchone()
            product_id = None
            
            # Common data for both tables
            data_map = {
                'k_id': item.get('k_id'),
                'country': item.get('country'),
                'k_position': 0 if item.get('k_position') == 'index' else item.get('k_position'),
                'name': item.get('name'),
                'launch_date': item.get('launch_date'),
                'product_rating': item.get('product_rating'),
                'main_category': item.get('main_category'),
                'second_category': item.get('second_category'),
                'third_category': item.get('third_category'),
                'creator_conversion_ratio': item.get('creator_conversion_ratio'),
                'revenue': item.get('revenue'),
                'revenue_history': item.get('revenue_history'),
                'revenue_growth_rate': item.get('revenue_growth_rate'),
                'sales': item.get('sales'),
                'unit_price': item.get('unit_price'),
                'updated_at': datetime.now()
            }
            
            # PRODUCTS table columns
            products_columns = [
                'k_id',
                'country',
                'k_position',
                'name',
                'launch_date',
                'product_rating',
                'main_category',
                'second_category',
                'third_category',
                'creator_conversion_ratio',
                'revenue',
                'revenue_history',
                'revenue_growth_rate',
                'sales',
                'unit_price',
                'updated_at'
            ]
            product_values = [data_map[col] for col in products_columns]

            if existing_product:
                product_id = existing_product[0]
                # Update
                # Construct SET clause
                set_clause = ", ".join([f"{col} = %s" for col in products_columns if col != 'k_id'])
                
                # Values for update (exclude id from set values, but need it for WHERE)
                # product_values has id at index 0 (based on products_columns order)
                update_values = product_values[1:] + [product_id]
                
                sql = f"UPDATE products SET {set_clause} WHERE id = %s"
                cursor.execute(sql, update_values)

                print('')
                print(f'Updating product {product_id}...')
                print('sql: ', sql)
                print('product_values: ', product_values)
                print('update_values: ', update_values)
                print('')
            
            else:
                # Insert
                placeholders = ", ".join(["%s"] * len(products_columns))
                col_names = ", ".join(products_columns)
                
                sql = f"INSERT INTO products ({col_names}) VALUES ({placeholders}) RETURNING id"
                cursor.execute(sql, product_values)
                product_id = cursor.fetchone()[0] 

                print('')
                print(f'Inserting product {product_id}...')
                print('sql: ', sql)
                print('product_values: ', product_values)
                print('')

            # SECOND: Download Image
            try:
                print('')
                print('[ SELENIUM ] Downloading image...')
                project_root = os.path.dirname(parent_parent_parent)
                images_dir = os.path.join(project_root, 'public', 'images', 'products')
                if not os.path.exists(images_dir):
                    os.makedirs(images_dir)
                
                image_url = f"https://img.kalocdn.com/tiktok.product/{k_id}/cover.png"
                image_path = os.path.join(images_dir, f"{product_id}.png")
                
                # Check if image already exists to avoid re-downloading (optional, but good practice)
                # But user requirement implies we should ensure it's there. Overwriting is safer if image changed.
                
                response = requests.get(image_url, stream=True)
                if response.status_code == 200:
                    with open(image_path, 'wb') as f:
                        for chunk in response.iter_content(1024):
                            f.write(chunk)
                    print(f'[ SELENIUM ] downloaded image for product: {product_id}')
                else:
                    print(f"[ SELENIUM ] Failed to download image for product {product_id} (k_id: {k_id}). Status: {response.status_code}")
            except Exception as e_img:
                print('')
                print('')
                print('')
                print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
                print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
                print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
                print(f"Error downloading image for product {product_id}: {e_img}")
                print('')
                print('')
                print('')

        conn.commit()
        print('')
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
