import json
import os

from request_categories.database.main import main as db_handler
from request_categories.get_categories import get_categories

def main():
    # Use absolute path or relative to current execution context
    # Assuming script is run from project root or same dir
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sample_file = os.path.join(current_dir, 'sample.json')
    
    if not os.path.exists(sample_file):
        print(f"Error: {sample_file} not found.")
        return

    result = get_categories(sample_file)
    
    db_handler(result)

if __name__ == "__main__":
    main()