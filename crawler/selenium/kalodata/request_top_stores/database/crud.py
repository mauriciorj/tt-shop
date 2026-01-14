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
                'k_id': item.get('k_id'),
                'country': "br",
                'k_position': refined_k_position,
                'name': item.get('name'),
                'type': item.get('type'),
                'region': item.get('region'),
                'main_category': item.get('main_category'),
                'second_category': item.get('second_category'),
                'third_category': item.get('third_category'),
                'revenue': item.get('revenue'),
                'revenue_history': item.get('revenue_history'),
                'revenue_growth_rate': item.get('revenue_growth_rate'),
                'sales': item.get('sales'),
                'unit_price': item.get('unit_price'),
                'updated_at': datetime.now()
            }

def select(cursor, k_id):
    cursor.execute("SELECT id FROM stores WHERE k_id = %s", (k_id,))
    select_store = cursor.fetchone()
    return select_store

def update(cursor, select_store, stores_columns, stores_values):
    store_id = select_store[0]
    set_clause = ", ".join([f"{col} = %s" for col in stores_columns if col != 'k_id'])

    update_values = stores_values[1:] + [store_id]
                
    sql = f"UPDATE stores SET {set_clause} WHERE id = %s"
    cursor.execute(sql, update_values)

    console(store_id, sql, update_values)

    return True

def insert(cursor, stores_columns, stores_values):
    placeholders = ", ".join(["%s"] * len(stores_columns))
    col_names = ", ".join(stores_columns)
                
    sql = f"INSERT INTO stores ({col_names}) VALUES ({placeholders}) RETURNING id"
    cursor.execute(sql, stores_values)
    store_id = cursor.fetchone()[0]

    console(store_id, sql, stores_values)

    return store_id