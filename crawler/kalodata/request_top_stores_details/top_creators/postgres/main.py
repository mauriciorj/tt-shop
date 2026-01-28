import sys
from datetime import datetime

from utils.save_error import save_error
from db.client import connect_to_database
from request_top_stores_details.top_creators.postgres.download_image import download_image
from request_top_stores_details.top_creators.postgres.crud import map_data
from request_top_stores_details.top_creators.postgres.crud import select
from request_top_stores_details.top_creators.postgres.crud import update
from request_top_stores_details.top_creators.postgres.crud import insert

# CREATORS table columns
creators_columns = [
    'k_id',
    'tt_account',
    'tt_nickname',
    'tt_followers',
    'k_revenue',
    'k_video_revenue',
    'k_live_revenue',
    'updated_at'
]

def main(formated_data):
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

            # STEP 01
            # If there is another creator with the same 'k_position' it will be changed to NULL
            select_creator = select(cursor, k_id)

            creator_id = None

            # Common data for both tables
            data_mapped = map_data(item)
            
            creator_values = [data_mapped[col] for col in creators_columns]

            # STEP 02
            # Update or insert the values in stores
            if select_creator:
                update(cursor, select_creator, creators_columns, creator_values)
            
            else:
                creator_id = insert(cursor, creators_columns, creator_values)

            # STEP 03
            # Download image
            print('')
            print(f'[ SELENIUM ] Downloading images for creator {k_id}...')
            download_image(creator_id, k_id)
            print(f'[ SELENIUM ] Downloaded images.')

        conn.commit()
        print('')
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        save_error(source='request_top_stores_details/top_creators/postgres/main', error=e)
        sys.exit(1)

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True

if __name__ == "__main__":
    main()
