import sys

from utils.save_error import save_error
from db.client import connect_to_database
from request_top_stores.postgres.update_k_position import update_k_position
from request_top_stores.postgres.download_image import download_image
from request_top_stores.postgres.crud import map_data
from request_top_stores.postgres.crud import select
from request_top_stores.postgres.crud import update
from request_top_stores.postgres.crud import insert

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
            # update_k_position(cursor, item)

            # STEP 02
            # Check the "stores" table for existing k_id
            select_store = select(cursor, k_id)
            
            store_id = None
            
            data_mapped = map_data(item)
            
            stores_values = [data_mapped[col] for col in stores_columns]

            # STEP 03
            # Update or insert the values in stores
            if select_store:
                update(cursor, select_store, stores_columns, stores_values)
            
            else:
                store_id = insert(cursor, stores_columns, stores_values)

            # STEP 04
            # Download image
            download_image(store_id, k_id)

        conn.commit()
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        save_error(source='request_top_stores/postgres/main', error=e)

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True

if __name__ == "__main__":
    main()