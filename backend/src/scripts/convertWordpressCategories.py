import json
import re
import random
import time

def extract_hebrew_text(display_text):
    """
    Extract Hebrew text from display field.
    Assumes Hebrew text comes before English text.
    """
    # Split by common patterns that separate Hebrew from English
    # Look for patterns like "Hebrew ENGLISH" or "Hebrew English"
    parts = re.split(r'\s+[A-Z][A-Z\s]+$', display_text)
    if len(parts) > 1:
        return parts[0].strip()
    
    # If no clear pattern, try to find Hebrew characters
    hebrew_part = re.findall(r'[\u0590-\u05FF\s]+', display_text)
    if hebrew_part:
        return hebrew_part[0].strip()
    
    # Fallback: return the whole display text
    return display_text.strip()

def find_parent_name(parent_id, categories_dict):
    """
    Find parent category name by parent_id.
    Returns empty string if parent_id is -1 (root category).
    """
    if parent_id == -1:
        return ""
    
    if parent_id in categories_dict:
        return categories_dict[parent_id]["name"]
    
    return ""

def generate_object_id():
    """Generate a MongoDB-like ObjectId string without requiring pymongo"""
    # ObjectId is 24 hex characters (12 bytes)
    # Format: 4-byte timestamp + 5-byte random + 3-byte counter
    timestamp = hex(int(time.time()))[2:]  # Current timestamp in hex
    random_part = ''.join([hex(random.randint(0, 15))[2:] for _ in range(10)])  # 10 random hex chars
    counter_part = hex(random.randint(0, 16777215))[2:].zfill(6)  # 6-char counter
    
    object_id = (timestamp + random_part + counter_part)[:24].ljust(24, '0')
    return object_id

def convert_categories(source_categories):
    """
    Convert source categories to MongoDB format.
    
    Args:
        source_categories: List of category dictionaries in source format
    
    Returns:
        List of category dictionaries in MongoDB format
    """
    
    # First pass: create a lookup dictionary for parent resolution
    categories_dict = {}
    for category in source_categories:
        categories_dict[category["id"]] = category
    
    # Second pass: convert to MongoDB format
    mongodb_categories = []
    
    for category in source_categories:
        # Extract Hebrew text from display field
        hebrew_text = extract_hebrew_text(category["display"])
        
        # Find parent name
        parent_name = find_parent_name(category["parent_id"], categories_dict)
        
        # Create MongoDB format category
        mongodb_category = {
            "_id": {
                "$oid": generate_object_id()
            },
            "name": category["name"],
            "text": hebrew_text,
            "parent": parent_name,
            "products": [],  # Empty array as in the example
            "__v": 0  # Version field, starting at 0 for new imports
        }
        
        mongodb_categories.append(mongodb_category)
    
    return mongodb_categories

def load_source_categories(input_file):
    """
    Load categories from input file.
    Assumes each line is a JSON object.
    """
    categories = []
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    category = json.loads(line)
                    categories.append(category)
    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found.")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return []
    
    return categories

def save_mongodb_categories(categories, output_file):
    """
    Save converted categories to output file in MongoDB format.
    """
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(categories, f, ensure_ascii=False, indent=2)
        print(f"Successfully saved {len(categories)} categories to '{output_file}'")
    except Exception as e:
        print(f"Error saving to file: {e}")

def main():
    """Main function to run the conversion"""
    
    # Sample data from your request (for testing)
    sample_data = [
        {"id": 17, "name": "fused-glass", "order": 1, "display": "פיוזינג בזכוכית FUSED GLASS", "parent_id": -1, "description": "עיצוב בזכוכית ספקטרום 96\r\nנחשפתי לאמנות הפיוזינג בזכוכית מסוף שנת 2019, ומאז יוצרת ונהניית."},
        {"id": 53, "name": "crafts", "order": 2, "display": "אמנויות ARTS AND CRAFTS", "parent_id": -1, "description": "אמנות בשילוב עבודות יד"},
        {"id": 52, "name": "drawings", "order": 5, "display": "ציורים DRAWINGS", "parent_id": -1, "description": "משחר ילדותי אהבתי לצייר טבע, דומם בעיקר עם צבעי מים אקוורל."},
        {"id": 42, "name": "jewelry", "order": 10, "display": "תכשיטים JEWELRY", "parent_id": -1, "description": ""},
        {"id": 48, "name": "brooches", "order": 11, "display": "סיכות BROOCHES", "parent_id": 42, "description": ""},
        {"id": 43, "name": "earrings", "order": 12, "display": "עגילים EARINGS", "parent_id": 42, "description": "כסף 925 וחרוזי גרנט. ריקוע"},
        {"id": 49, "name": "bracelets", "order": 13, "display": "צמידים BRACIETS", "parent_id": 42, "description": ""},
        {"id": 50, "name": "necklaces", "order": 14, "display": "שרשראות NECKLACES", "parent_id": 42, "description": "כסף 925 וחרוז לאפיס לאזולי"},
        {"id": 151, "name": "body-jewelry", "order": 15, "display": "תכשיטי גוף BODY JEWELRY", "parent_id": 42, "description": ""},
        {"id": 51, "name": "tiaras", "order": 16, "display": "כתרים TIARAS", "parent_id": 42, "description": "טירה מרדיד נחושת מצופה זהב 18 "},
        {"id": 164, "name": "nature", "order": 17, "display": "טבע NATURE", "parent_id": 42, "description": "תכשיטים בהשראת הטבע. נופים, פירות, צמחים"},
        {"id": 166, "name": "ethnography", "order": 19, "display": "תרבויות עמים ETHNOGRAPHY", "parent_id": 42, "description": "תכשיטים בהשראת תרבויות עמים"},
        {"id": 184, "name": "judaica", "order": 20, "display": "יודאיקה JUDAICA", "parent_id": 42, "description": ""},
        {"id": 214, "name": "objects", "order": 21, "display": "אובייקטים OBJECTS", "parent_id": 42, "description": ""},
        {"id": 207, "name": "urban", "order": 6, "display": "אורבני URBAN", "parent_id": 52, "description": ""},
        {"id": 182, "name": "still-paintings", "order": 7, "display": "דומם STILL PAINTINGS", "parent_id": 52, "description": ""},
        {"id": 183, "name": "portraits", "order": 8, "display": "דיוקן PORTRAITS", "parent_id": 52, "description": ""},
        {"id": 181, "name": "nature-paintings", "order": 9, "display": "טבע NATURE PAINTINGS", "parent_id": 52, "description": ""}
    ]
    
    print("Converting categories from source format to MongoDB format...")
    
    # Convert the sample data
    converted_categories = convert_categories(sample_data)
    
    # Save to output file
    save_mongodb_categories(converted_categories, 'converted_categories.json')
    
    # Print a few examples
    print("\nFirst 3 converted categories:")
    for i, category in enumerate(converted_categories[:3]):
        print(f"\n{i+1}. {category['name']}:")
        print(f"   Text: {category['text']}")
        print(f"   Parent: {category['parent']}")
        print(f"   ID: {category['_id']['$oid']}")

if __name__ == "__main__":
    main()
