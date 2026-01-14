import sys

from logger.error import error

def update_k_position(cursor, item):
    try:
        # Prepare k_position value
        refined_k_position = 0 if item.get('k_position') == 'index' else item.get('k_position')
        k_id = item.get('k_id')
        
        # Check for conflict: specific position already taken by ANOTHER store
        if refined_k_position is not None:
            cursor.execute("SELECT id, k_id FROM products WHERE k_position = %s", (refined_k_position,))
            conflict = cursor.fetchone()
            if conflict:
                conflict_id, conflict_k_id = conflict
                # If the occupant is NOT the current store we are processing
                if str(conflict_k_id) != str(k_id):
                    cursor.execute("UPDATE products SET k_position = NULL WHERE id = %s", (conflict_id,))

    except Exception as e_img:
        error(e_img)
        sys.exit(1)