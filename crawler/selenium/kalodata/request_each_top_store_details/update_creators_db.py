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
            cursor.execute("SELECT id FROM creators WHERE k_id = %s", (k_id,))
            existing_creator = cursor.fetchone()
            creator_id = None
            
            # Common data for both tables
            data_map = {
                'k_id': item.get('k_id'),
                'tt_account': item.get('tt_account'),
                'tt_nickname': item.get('tt_nickname'),
                'tt_followers': item.get('tt_followers'),
                'revenue': item.get('revenue'),
                'video_revenue': item.get('video_revenue'),
                'live_revenue': item.get('live_revenue'),
                'updated_at': datetime.now()
            }
            
            # CREATORS table columns
            creators_columns = [
                'k_id',
                'tt_account',
                'tt_nickname',
                'tt_followers',
                'revenue',
                'video_revenue',
                'live_revenue',
                'updated_at'
            ]
            creator_values = [data_map[col] for col in creators_columns]

            if existing_creator:
                creator_id = existing_creator[0]
                # Update
                # Construct SET clause
                set_clause = ", ".join([f"{col} = %s" for col in creators_columns if col != 'k_id'])
                
                # Values for update (exclude k_id from set values, but need it for WHERE)
                # creator_values has k_id at index 0 (based on creators_columns order)
                update_values = creator_values[1:] + [k_id]
                
                sql = f"UPDATE creators SET {set_clause} WHERE k_id = %s"
                cursor.execute(sql, update_values)
            
            else:
                # Insert
                placeholders = ", ".join(["%s"] * len(creators_columns))
                col_names = ", ".join(creators_columns)
                sql = f"INSERT INTO creators ({col_names}) VALUES ({placeholders}) RETURNING id"
                cursor.execute(sql, creator_values)
                creator_id = cursor.fetchone()[0] 

            # SECOND: Download Image
            try:
                print('')
                print('[ SELENIUM ] Downloading image...')
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
                    print(f'[ SELENIUM ] downloaded image for creator: {creator_id}')
                else:
                    print(f"[ SELENIUM ] Failed to download image for creator {creator_id} (k_id: {k_id}). Status: {response.status_code}")
            except Exception as e_img:
                print(f"[ SELENIUM ] Error downloading image for creator {creator_id}: {e_img}")

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
