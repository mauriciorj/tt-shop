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

from logger.error import error

def update_k_position(cursor, item):
    try:
        print(f'[ SELENIUM ] Update K Position Step 000')
        # Prepare k_position value
        refined_k_position = 0 if item.get('k_position') == 'index' else item.get('k_position')
        print(f'[ SELENIUM ] Update K Position Step 111 {refined_k_position}')
        k_id = item.get('k_id')
        print(f'[ SELENIUM ] Update K Position Step 222 {k_id}')
        
        # Check for conflict: specific position already taken by ANOTHER store
        if refined_k_position is not None:
            print(f'[ SELENIUM ] Update K Position Step 333')
            cursor.execute("SELECT id, k_id FROM products WHERE k_position = %s", (refined_k_position,))
            conflict = cursor.fetchone()
            print(f'[ SELENIUM ] Update K Position Step 444 {conflict}')
            if conflict:
                print(f'[ SELENIUM ] Update K Position Step 555')
                conflict_id, conflict_k_id = conflict
                print(f'[ SELENIUM ] Update K Position Step 666 {conflict_id, conflict_k_id}')
                # If the occupant is NOT the current store we are processing
                if str(conflict_k_id) != str(k_id):
                    print(f'[ SELENIUM ] Update K Position Step 777')
                    cursor.execute("UPDATE products SET k_position = NULL WHERE id = %s", (conflict_id,))
                    print(f'[ SELENIUM ] Update K Position Step 888')

    except Exception as e_img:
        error(e_img)
        sys.exit(1)