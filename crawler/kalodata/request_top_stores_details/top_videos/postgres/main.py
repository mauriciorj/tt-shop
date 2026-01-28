import sys
from datetime import datetime

from utils.save_error import save_error
from db.client import connect_to_database
from request_top_stores_details.top_videos.postgres.download_image import download_image
from request_top_stores_details.top_videos.postgres.crud import map_data
from request_top_stores_details.top_videos.postgres.crud import select
from request_top_stores_details.top_videos.postgres.crud import update
from request_top_stores_details.top_videos.postgres.crud import insert

# VIDEO table columns
video_columns = [
    'k_id',
    'tt_account',
    'description',
    'views',
    'duration',
    'k_revenue',
    'k_sales',
    'updated_at'
]

def main(formated_data):
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

            # STEP 01
            # If there is another video with the same 'k_position' it will be changed to NULL
            select_video = select(cursor, k_id)
            
            video_id = None
            
            # Common data for both tables
            data_mapped = map_data(item)
            
            video_values = [data_mapped[col] for col in video_columns]

            if select_video:
                update(cursor, select_video, video_columns, video_values)
            
            else:
                video_id = insert(cursor, video_columns, video_values)

            # STEP 03
            # Download image
            download_image(video_id, k_id)

        conn.commit()
        print('')
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        save_error(source='request_top_stores_details/top_videos/postgres/main', error=e)
        sys.exit(1)

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True

if __name__ == "__main__":
    main()

