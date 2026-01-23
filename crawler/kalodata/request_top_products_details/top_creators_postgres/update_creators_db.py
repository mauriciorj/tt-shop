import sys
import os
import requests
import json
from datetime import datetime

# Adjust path to allow imports from crawler root
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata
parent_parent = os.path.dirname(parent) # selenium
parent_parent_parent = os.path.dirname(parent_parent) # crawler

# adding the parent directory to
# the sys.path.
sys.path.append(parent_parent_parent)

from logger.error import error
from db.client import connect_to_database

def update_creators_db(formated_data):
    print('')
    print('[ SELENIUM ] Saving Top Creators to DB...')

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

            # FIRST: Check the "creators" table for existing k_id
            cursor.execute("SELECT id, by_product FROM creators WHERE k_id = %s", (k_id,))
            existing_creator = cursor.fetchone()
            creator_id = None

            # Under the store page the creators shows the total revenue
            # The revenue per product will be get on request_each_top_product_details and stored in products table (top_creators)
            
            # Common data for both tables
            data_map = {
                'product_id': item.get('product_id'),
                'revenue': item.get('revenue'),
                'sales': item.get('sales'),
            }
            
            if existing_creator:
                creator_id = existing_creator[0]
                existing_by_product = existing_creator[1] if existing_creator[1] else []
                
                updated_by_product = []
                found_product = False
                
                # Check for existing product and update
                for prod_str in existing_by_product:
                    try:
                        # Depending on how it's stored, it might already be a dict if the driver converts JSONB, 
                        # but for TEXT[] usually it's strings.
                        prod_obj = json.loads(prod_str) if isinstance(prod_str, str) else prod_str
                        
                        if str(prod_obj.get('product_id')) == str(data_map.get('product_id')):
                            updated_by_product.append(data_map)
                            found_product = True
                        else:
                            updated_by_product.append(prod_obj)
                    except Exception as e:
                        # Keep original if parsing fails
                        print(f"Error parsing product data: {e}")
                        continue

                if not found_product:
                    updated_by_product.append(data_map)
                
                # Prepare for TEXT[] - list of JSON strings
                final_by_product = [json.dumps(p) for p in updated_by_product]
                
                sql = "UPDATE creators SET by_product = %s, updated_at = NOW() WHERE id = %s"
                cursor.execute(sql, (final_by_product, creator_id))
            
            else:
                # Insert
                placeholders = ['%s', '%s', '%s', '%s', '%s']
                col_names = ['k_id', 'tt_account', 'tt_nickname', 'tt_followers', 'by_product']
                creator_values = [item.get('k_id'), item.get('tt_account'), item.get('tt_nickname'), item.get('tt_followers'), item.get('by_product')]
                
                sql = f"INSERT INTO creators ({col_names}) VALUES ({placeholders}) RETURNING id"
                cursor.execute(sql, creator_values)
                creator_id = cursor.fetchone()[0] 

                # print('')
                # print(f'Inserting creator {creator_id}...')
                # print('sql: ', sql)
                # print('creator_values: ', creator_values)
                # print('')

            # SECOND: Download Image
            try:
                # print('')
                # print('[ SELENIUM ] Downloading image...')
                project_root = os.path.dirname(parent_parent_parent)
                images_dir = os.path.join(project_root, 'public', 'images', 'creators')
                if not os.path.exists(images_dir):
                    os.makedirs(images_dir)
                
                image_url = f"https://img.kalocdn.com/tiktok.creator/{k_id}/avatar_medium.png"
                image_path = os.path.join(images_dir, f"{creator_id}.png")
                
                # Check if image already exists to avoid re-downloading (optional, but good practice)
                # But user requirement implies we should ensure it's there. Overwriting is safer if image changed.
                
                response = requests.get(image_url, stream=True)
                if response.status_code == 200:
                    with open(image_path, 'wb') as f:
                        for chunk in response.iter_content(1024):
                            f.write(chunk)
                    # print(f'[ SELENIUM ] downloaded image for creator: {creator_id}')
                else:
                    print(f"[ SELENIUM ] Failed to download image for creator {creator_id} (k_id: {k_id}). Status: {response.status_code}")
            except Exception as e_img:
                error(e_img, 6)
                sys.exit(1)

        conn.commit()
        print('')
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        error(e, 6)
        sys.exit(1)
        return False

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True
