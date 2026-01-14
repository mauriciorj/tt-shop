import sys
import os
import requests
from datetime import datetime

# getting the name of the directory where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata
parent_parent = os.path.dirname(parent) # selenium
parent_parent_parent = os.path.dirname(parent_parent) # crawler

# adding the parent directory to the sys.path.
sys.path.append(current)
sys.path.append(parent)
sys.path.append(parent_parent)
sys.path.append(parent_parent_parent)

from logger.error import error
from db.client import connect_to_database
from update_k_position import update_k_position
from download_image import download_image
from crud import map_data
from crud import select
from crud import update
from crud import insert

products_columns = [
    'name',
    'country',
    'launch_date',
    'product_rating',
    'main_category',
    'second_category',
    'third_category',
    'unit_price',
    'k_id',
    'k_position',
    'k_creator_conversion_ratio',
    'k_revenue',
    'k_revenue_history',
    'k_revenue_growth_rate',
    'k_sales',
    'updated_at'
]
            
def main(formated_data):
    print('')
    print('[ SELENIUM ] Saving Top Products to DB...')

    conn = connect_to_database()
    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    try:
        cursor = conn.cursor()

        print('')
        print('')
        print(f'[ SELENIUM ] Step 000 formated_data: {formated_data}')
        print('')
        print('')
        
        for item in formated_data:
            k_id = item.get('k_id')
            if not k_id:
                continue


            # STEP 01
            # If there is another product with the same 'k_position' it will be changed to NULL
            print('')
            print(f'[ SELENIUM ] Step 000 item: {item}')
            update_k_position(cursor, item)

            # STEP 02
            # Check the "products" table for existing k_id
            print('')
            print(f'[ SELENIUM ] Step 001 update_k_position')
            select_product = select(cursor, k_id)

            print('')
            print(f'[ SELENIUM ] Step 002 select_product: {select_product}')
            product_id = None

            print('')
            print(f'[ SELENIUM ] Step 003 product_id: {product_id}')
            data_mapped = map_data(item)

            print('')
            print(f'[ SELENIUM ] Step 004 data_mapped: {data_mapped}')
            product_values = [data_mapped[col] for col in products_columns]

            # STEP 03
            # Update or insert the values in stores
            if select_product:
                print('')
                print(f'[ SELENIUM ] Step 005 product_values: {product_values}')
                update(cursor, select_product, products_columns, product_values)
            else:
                print('')
                print(f'[ SELENIUM ] Step 006 product_values: {product_values}')
                product_id = insert(cursor, products_columns, product_values)

            # STEP 04
            # Download image
            print('')
            print(f'[ SELENIUM ] Step 007 ...')
            download_image(product_id, k_id)
    
        conn.commit()
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        error(e)
        sys.exit(1)

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True


if __name__ == "__main__":
    main()