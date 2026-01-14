import sys
import os

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata

# adding the parent directory to
# the sys.path.
sys.path.append(parent)

from datetime import datetime
from logger.console import console

def data_map(get, refined_k_position):
     return {
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

def select(cursor, k_id):
    cursor.execute("SELECT id FROM products WHERE k_id = %s", (k_id,))
    select_product = cursor.fetchone()
    return select_product

def update(cursor, select_product, products_columns, product_values):
    product_id = select_product[0]
    set_clause = ", ".join([f"{col} = %s" for col in products_columns if col != 'k_id'])
                
    update_values = product_values[1:] + [product_id]
                
    sql = f"UPDATE products SET {set_clause} WHERE id = %s"
    cursor.execute(sql, update_values)

    console(product_id, sql, update_values)

    return True

def insert(cursor, products_columns, product_values):
    placeholders = ", ".join(["%s"] * len(products_columns))
    col_names = ", ".join(products_columns)
                
    sql = f"INSERT INTO products ({col_names}) VALUES ({placeholders}) RETURNING id"
    cursor.execute(sql, product_values)
    product_id = cursor.fetchone()[0] 

    console(product_id, sql, product_values)

    return product_id