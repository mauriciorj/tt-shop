import sys

from utils.save_error import save_error
from db.client import connect_to_database
from request_categories.postgres.crud import map_data
from request_categories.postgres.crud import select
from request_categories.postgres.crud import update
from request_categories.postgres.crud import insert

categories_columns = [
    'main_category_id',
    'main_category_name',
    'second_category_id',
    'second_category_name',
    'third_category_id',
    'third_category_name',
]
            
def main(formated_data):
    print('')
    print('[ SELENIUM ] Saving Categories to DB...')

    conn = connect_to_database()
    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    try:
        cursor = conn.cursor()
        
        for item in formated_data:
            main_category_id = item.get('main_category_id')
            if not main_category_id:
                continue

            # STEP 01
            # Check the "categories" table for existing main_category_id
            select_category = select(cursor, main_category_id)

            category_id = None

            data_mapped = map_data(item)

            category_values = [data_mapped[col] for col in categories_columns]

            # STEP 03
            # Update or insert the values in stores
            if select_category:
                update(cursor, select_category, categories_columns, category_values)
            else:
                category_id = insert(cursor, categories_columns, category_values)
    
        conn.commit()
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        save_error(source='request_categories/postgres/main', error=e)
        sys.exit(1)

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True


if __name__ == "__main__":
    main()