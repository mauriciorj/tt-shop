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
sys.path.append(parent)
sys.path.append(parent_parent)
sys.path.append(parent_parent_parent)

from logger.console import console

def map_data(item):
    print(f'[ SELENIUM ] map_data Step 000')
    data_mapped = {
                'name': item.get('name'),
                'country': item.get('country'),
                'launch_date': item.get('launch_date'),
                'product_rating': item.get('product_rating'),
                'main_category': item.get('main_category'),
                'second_category': item.get('second_category'),
                'third_category': item.get('third_category'),
                'unit_price': item.get('unit_price'),
                'k_id': item.get('k_id'),
                'k_position': 0 if item.get('k_position') == 'index' else item.get('k_position'),
                'k_creator_conversion_ratio': item.get('creator_conversion_ratio'),
                'k_revenue': item.get('revenue'),
                'k_revenue_history': item.get('revenue_history'),
                'k_revenue_growth_rate': item.get('revenue_growth_rate'),
                'k_sales': item.get('sales'),
                'updated_at': datetime.now()
            }
    print(f'[ SELENIUM ] map_data Step 111 {data_mapped}')
    return data_mapped

def select(cursor, k_id):
    cursor.execute("SELECT id FROM products WHERE k_id = %s", (k_id,))
    select_product = cursor.fetchone()
    return select_product

def update(cursor, select_product, products_columns, product_values):
    print('[ SELENIUM ] Updating Top Products to DB...')
    product_id = select_product[0]
    set_clause = ", ".join([f"{col} = %s" for col in products_columns if col != 'k_id'])
                
    update_values = product_values[1:] + [product_id]
                
    sql = f"UPDATE products SET {set_clause} WHERE id = %s"
    cursor.execute(sql, update_values)

    console(product_id, sql, update_values)

    return True

def insert(cursor, products_columns, product_values):
    print('[ SELENIUM ] Inserting Top Products to DB...')
    placeholders = ", ".join(["%s"] * len(products_columns))
    col_names = ", ".join(products_columns)
                
    sql = f"INSERT INTO products ({col_names}) VALUES ({placeholders}) RETURNING id"
    cursor.execute(sql, product_values)
    product_id = cursor.fetchone()[0] 

    console(product_id, sql, product_values)

    return product_id