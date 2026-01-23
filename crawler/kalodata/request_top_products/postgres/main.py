import sys

from logger.error import error
from db.client import connect_to_database
# from request_top_products.postgres.update_k_position import update_k_position
from request_top_products.postgres.download_image import download_image
from request_top_products.postgres.crud import map_data
from request_top_products.postgres.crud import select
from request_top_products.postgres.crud import update
from request_top_products.postgres.crud import insert

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
        
        for item in formated_data:
            k_id = item.get('k_id')
            if not k_id:
                continue

            # STEP 01
            # If there is another product with the same 'k_position' it will be changed to NULL
            # update_k_position(cursor, item)

            # STEP 02
            # Check the "products" table for existing k_id
            select_product = select(cursor, k_id)

            product_id = None

            data_mapped = map_data(item)

            product_values = [data_mapped[col] for col in products_columns]

            # STEP 03
            # Update or insert the values in stores
            if select_product:
                update(cursor, select_product, products_columns, product_values)
            else:
                product_id = insert(cursor, products_columns, product_values)

            # STEP 04
            # Download image
            download_image(product_id, k_id)
    
        conn.commit()
        print(f"[ SELENIUM ] Processed {len(formated_data)} items successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        error(e, 6)
        sys.exit(1)

    finally:
        if conn:
            print(f"[ SELENIUM ] Closing connection...")
            conn.close()
        return True


if __name__ == "__main__":
    main()