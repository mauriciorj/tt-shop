def normalize_url(text):
    if not text:
        return None
    
    # Normalize unicode characters to NFD (Decomposition)
    text = unicodedata.normalize('NFD', str(text))
    # Remove diacritics (combining characters are in the range \u0300-\u036f)
    text = re.sub(r'[\u0300-\u036f]', '', text)
    # Trim, convert to lowercase, and replace whitespace with hyphens
    return re.sub(r'\s+', '-', text.strip().lower())