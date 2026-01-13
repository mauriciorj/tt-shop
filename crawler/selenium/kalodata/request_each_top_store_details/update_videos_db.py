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

def update_videos_db(formated_data):
    print('')
    print('[ SELENIUM ] Saving Top Videos to DB...')

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

            # FIRST: Check the "videos" table for existing k_id
            cursor.execute("SELECT id FROM videos WHERE k_id = %s", (k_id,))
            existing_video = cursor.fetchone()
            video_id = None
            
            # Common data for both tables
            data_map = {
                'k_id': item.get('k_id'),
                'tt_account': item.get('tt_account'),
                'description': item.get('description'),
                'views': item.get('views'),
                'duration': item.get('duration'),
                'revenue': item.get('revenue'),
                'sales': item.get('sales'),
                'updated_at': datetime.now()
            }
            
            # VIDEO table columns
            video_columns = [
                'k_id',
                'tt_account',
                'description',
                'views',
                'duration',
                'revenue',
                'sales',
                'updated_at'
            ]
            video_values = [data_map[col] for col in video_columns]

            if existing_video:
                video_id = existing_video[0]
                # Update
                # Construct SET clause
                set_clause = ", ".join([f"{col} = %s" for col in video_columns if col != 'k_id'])
                
                # Values for update (exclude k_id from set values, but need it for WHERE)
                # video_values has k_id at index 0 (based on video_columns order)
                update_values = video_values[1:] + [k_id]
                
                sql = f"UPDATE videos SET {set_clause} WHERE k_id = %s"
                cursor.execute(sql, update_values)
            
            else:
                # Insert
                placeholders = ", ".join(["%s"] * len(video_columns))
                col_names = ", ".join(video_columns)
                sql = f"INSERT INTO videos ({col_names}) VALUES ({placeholders}) RETURNING id"
                cursor.execute(sql, video_values)
                video_id = cursor.fetchone()[0] 

            # SECOND: Download Image
            try:
                print('')
                print('[ SELENIUM ] Downloading image...')
                project_root = os.path.dirname(parent_parent_parent)
                images_dir = os.path.join(project_root, 'public', 'images', 'videos')
                if not os.path.exists(images_dir):
                    os.makedirs(images_dir)
                
                image_url = f"https://img.kalocdn.com/tiktok.video/{k_id}/cover.png"
                image_path = os.path.join(images_dir, f"{video_id}.png")
                
                # Check if image already exists to avoid re-downloading (optional, but good practice)
                # But user requirement implies we should ensure it's there. Overwriting is safer if image changed.
                
                response = requests.get(image_url, stream=True)
                if response.status_code == 200:
                    with open(image_path, 'wb') as f:
                        for chunk in response.iter_content(1024):
                            f.write(chunk)
                    print(f'[ SELENIUM ] downloaded image for creator: {video_id}')
                else:
                    print(f"[ SELENIUM ] Failed to download image for creator {video_id} (k_id: {k_id}). Status: {response.status_code}")
            except Exception as e_img:
                print(f"[ SELENIUM ] Error downloading image for creator {video_id}: {e_img}")

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
