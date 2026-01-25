import json
import os
from datetime import datetime

def save_error(source = None, error = None):
    current = os.path.dirname(os.path.realpath(__file__))
    parent = os.path.dirname(current) # kalodata

    file_path = os.path.join(parent, 'logs', 'errors.json')
    
    if not os.path.exists(os.path.dirname(file_path)):
        os.makedirs(os.path.dirname(file_path))

    errors = []
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if content:
                    errors = json.loads(content)
                    if not isinstance(errors, list):
                        errors = []
        except Exception:
            errors = []

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{timestamp}] - [{source}] - {error}"
    errors.append(entry)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(errors, f, ensure_ascii=False, indent=4)

    print('\n')
    print(f"[ SELENIUM ] Error saved to logs/errors.json")
    print('\n')