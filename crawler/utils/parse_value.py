def parse_value(value):
    if not isinstance(value, str):
        return value
        
    # Remove currency symbol and percentages
    clean_value = value.replace('$', '').replace('%', '')
    
    multiplier = 1
    if 'k' in clean_value.lower():
        multiplier = 1000
        clean_value = clean_value.lower().replace('k', '')
    elif 'm' in clean_value.lower():
        multiplier = 1000000
        clean_value = clean_value.lower().replace('m', '')
    elif 'b' in clean_value.lower():
        multiplier = 1000000000
        clean_value = clean_value.lower().replace('b', '')
        
    try:
        return float(clean_value) * multiplier
    except ValueError:
        return 0.0