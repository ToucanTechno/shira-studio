import json
import random
import string
import csv
from datetime import datetime
from bson import ObjectId
from urllib.parse import unquote
from collections import defaultdict

# Category mapping from WordPress names to MongoDB ObjectIds
CATEGORY_MAPPING = {
    'fused-glass': '68e95406752a48606d7d6416',
    'crafts': '68e95406dc3f250a575f5dda',
    'drawings': '68e95406909d43bcc9afea46',
    'jewelry': '68e95406ea4dd4b3ba9734a4',
    'brooches': '68e9540676bec99a5d8f4184',
    'earrings': '68e9540605cbd157c339a2ff',
    'bracelets': '68e95406e2030b03a69940e2',
    'necklaces': '68e95406d98f96ab4d6b73df',
    'body-jewelry': '68e95406d252e749860ec7ce',
    'tiaras': '68e95406fedc2e237b37ea90',
    'nature': '68e95406fac656eb6571ba71',
    'ethnography': '68e954064b6cae7a7290b908',
    'judaica': '68e954062d16b2cc0441018d',
    'objects': '68e95406eb0f28fc0b1b17df',
    'urban': '68e95406931560fe35062b55',
    'still-paintings': '68e95406373d7f78bf95ef73',
    'portraits': '68e9540670f91b8ec86a7beb',
    'nature-paintings': '68e9540679da1d0f185c323f'
}

# Cloudinary configuration
CLOUDINARY_CONFIG = {
    'cloud_name': 'deod9mqrf',
    'api_key': '548125244814916',  # Get from Cloudinary dashboard
    'api_secret': 'rTwiYlKh_Jyzs6U8gYPUbQSshbI',  # Get from Cloudinary dashboard
    'folder': 'shira-studio-prod/products'
}

def generate_sku(existing_skus=None, length=6):
    """Generate a unique random alphanumeric SKU"""
    if existing_skus is None:
        existing_skus = set()
    
    while True:
        sku = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        if sku not in existing_skus:
            existing_skus.add(sku)
            return sku

def decode_slug(encoded_slug):
    """Decode URL-encoded Hebrew slug"""
    return unquote(encoded_slug)

def load_attachments_csv(csv_file):
    """
    Load WordPress attachments from CSV file
    Returns:
    - attachments_by_id: dict mapping attachment_id -> {url, title, post_parent}
    - attachments_by_parent: dict mapping product_id -> list of attachments
    """
    attachments_by_id = {}
    attachments_by_parent = defaultdict(list)
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            attachment_id = int(row['ID'])
            post_parent = int(row['post_parent']) if row.get('post_parent') and row['post_parent'] != '0' else None
            post_date = row.get('post_date', '')
            
            attachment_info = {
                'id': attachment_id,
                'url': row['guid'],
                'title': row['post_title'],
                'post_parent': post_parent,
                'post_date': post_date
            }
            
            attachments_by_id[attachment_id] = attachment_info
            
            # Group by parent product
            if post_parent:
                attachments_by_parent[post_parent].append(attachment_info)
    
    # Sort attachments for each product by date (oldest first)
    for product_id in attachments_by_parent:
        attachments_by_parent[product_id].sort(key=lambda x: x['post_date'])
    
    print(f"✅ Loaded {len(attachments_by_id)} attachments")
    print(f"✅ Found images for {len(attachments_by_parent)} products")
    
    return attachments_by_id, attachments_by_parent

def map_categories(wp_categories):
    """Map WordPress categories to MongoDB ObjectIds"""
    category_oids = []
    for cat in wp_categories:
        cat_name = cat.get('name')
        if cat_name in CATEGORY_MAPPING:
            category_oids.append(CATEGORY_MAPPING[cat_name])
    return category_oids

def parse_date(date_string):
    """Convert WordPress date to ISO format"""
    if not date_string:
        return None
    try:
        dt = datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S.%f')
        return dt.isoformat() + 'Z'
    except:
        try:
            dt = datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S')
            return dt.isoformat() + 'Z'
        except:
            return None

def safe_float(value, default=None):
    """Safely convert to float"""
    if value is None or value == '':
        return default
    try:
        return float(value)
    except:
        return default

def safe_int(value, default=None):
    """Safely convert to integer"""
    if value is None or value == '':
        return default
    try:
        if isinstance(value, str):
            value = value.strip()
            if value == '':
                return default
        return int(value)
    except:
        return default

def upload_to_cloudinary(image_url, product_id, order=0, alt_text=''):
    """
    Upload image from URL to Cloudinary
    Returns image object for MongoDB
    """
    try:
        import cloudinary
        import cloudinary.uploader
        
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=CLOUDINARY_CONFIG['cloud_name'],
            api_key=CLOUDINARY_CONFIG['api_key'],
            api_secret=CLOUDINARY_CONFIG['api_secret']
        )
        
        # Generate public_id
        public_id = f"{CLOUDINARY_CONFIG['folder']}/product_{product_id}_{order}"
        
        # Upload image
        result = cloudinary.uploader.upload(
            image_url,
            public_id=public_id,
            format='webp',
            overwrite=True
        )
        
        return {
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'order': order,
            'alt_text': alt_text,
            '_id': {'$oid': str(ObjectId())}
        }
            
    except Exception as e:
        print(f"  ⚠️  Error uploading to Cloudinary: {e}")
        # Return placeholder structure with original URL
        return {
            'url': image_url,
            'public_id': f"{CLOUDINARY_CONFIG['folder']}/product_{product_id}_{order}",
            'order': order,
            'alt_text': alt_text,
            '_id': {'$oid': str(ObjectId())}
        }

def transform_product(wp_product, attachments_by_id, attachments_by_parent, existing_skus=None, upload_images=False):
    """Transform WordPress product to MongoDB format"""
    
    # Skip non-published products
    if wp_product.get('status') != 'publish':
        return None
    
    product_id = wp_product['id']
    meta = wp_product.get('meta', {})
    
    # Generate SKU
    sku = meta.get('_sku', '').strip() or generate_sku(existing_skus)
    
    # Map categories
    categories = map_categories(wp_product.get('categories', []))
    
    # Handle images using post_parent relationship
    images = []
    
    # Get all attachments for this product (sorted by date)
    product_attachments = attachments_by_parent.get(product_id, [])
    
    if product_attachments:
        # Use attachments linked via post_parent
        for idx, attachment in enumerate(product_attachments):
            alt_text = f"{wp_product.get('title', '')} - {attachment['title']}" if attachment['title'] else f"{wp_product.get('title', '')} - Image {idx + 1}"
            
            if upload_images:
                # Upload to Cloudinary
                img = upload_to_cloudinary(
                    attachment['url'],
                    product_id,
                    order=idx,
                    alt_text=alt_text
                )
            else:
                # Use original URL
                img = {
                    'url': attachment['url'],
                    'public_id': f"{CLOUDINARY_CONFIG['folder']}/product_{product_id}_{idx}",
                    'order': idx,
                    'alt_text': alt_text,
                    '_id': {'$oid': str(ObjectId())}
                }
            
            if img:
                images.append(img)
    
    else:
        # Fallback: Try thumbnail_id or featured_image
        thumbnail_id = safe_int(meta.get('_thumbnail_id'))
        featured_url = wp_product.get('featured_image')
        
        if thumbnail_id and thumbnail_id in attachments_by_id:
            attachment = attachments_by_id[thumbnail_id]
            alt_text = f"{wp_product.get('title', '')} - {attachment['title']}" if attachment['title'] else f"{wp_product.get('title', '')} - Image 1"
            
            if upload_images:
                img = upload_to_cloudinary(
                    attachment['url'],
                    product_id,
                    order=0,
                    alt_text=alt_text
                )
            else:
                img = {
                    'url': attachment['url'],
                    'public_id': f"{CLOUDINARY_CONFIG['folder']}/product_{product_id}_0",
                    'order': 0,
                    'alt_text': alt_text,
                    '_id': {'$oid': str(ObjectId())}
                }
            
            if img:
                images.append(img)
        
        elif featured_url:
            alt_text = f"{wp_product.get('title', '')} - Image 1"
            
            if upload_images:
                img = upload_to_cloudinary(
                    featured_url,
                    product_id,
                    order=0,
                    alt_text=alt_text
                )
            else:
                img = {
                    'url': featured_url,
                    'public_id': f"{CLOUDINARY_CONFIG['folder']}/product_{product_id}_0",
                    'order': 0,
                    'alt_text': alt_text,
                    '_id': {'$oid': str(ObjectId())}
                }
            
            if img:
                images.append(img)
    
    # Build MongoDB document
    return {
        '_id': product_id,
        'display_name': wp_product.get('title', ''),
        'name': decode_slug(wp_product.get('slug', '')),
        'description': wp_product.get('content', ''),
        'created_at': parse_date(wp_product.get('created_at')),
        'modified_at': parse_date(wp_product.get('updated_at')),
        'categories': categories,
        
        'pricing': {
            'price': safe_float(meta.get('_price')) or safe_float(meta.get('_regular_price')),
            'sale_price': safe_float(meta.get('_sale_price')),
            'sale_price_dates_from': meta.get('_sale_price_dates_from') or None,
            'sale_price_dates_to': meta.get('_sale_price_dates_to') or None
        },
        
        'inventory': {
            'sku': sku,
            'stock': safe_int(meta.get('_stock'))
        },
        
        'physical_properties': {
            'width': safe_float(meta.get('_width')),
            'height': safe_float(meta.get('_height')),
            'length': safe_float(meta.get('_length')),
            'weight': safe_float(meta.get('_weight'))
        },
        
        'images': images,
        
        'stats': {
            'total_sales': safe_int(meta.get('total_sales'), 0),
            'views': 0,
            'cart_inserts': 0
        }
    }

def process_products_file(input_file, attachments_csv, output_file, upload_images=False):
    """Process WordPress products JSON file"""
    
    print(f"📂 Loading attachments from {attachments_csv}...")
    attachments_by_id, attachments_by_parent = load_attachments_csv(attachments_csv)
    
    print(f"📂 Reading products from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        wp_products = json.load(f)
    
    print(f"📦 Found {len(wp_products)} products")
    
    if upload_images:
        print(f"🌥️  Cloudinary upload: ENABLED")
    else:
        print(f"📋 Cloudinary upload: DISABLED (using original URLs)")
    
    print()
    
    transformed_products = []
    skipped_count = 0
    existing_skus = set()
    products_with_images = 0
    total_images = 0
    
    for i, wp_product in enumerate(wp_products, 1):
        title = wp_product.get('title', 'Untitled')
        print(f"[{i}/{len(wp_products)}] Processing: {title[:50]}...")
        
        product = transform_product(wp_product, attachments_by_id, attachments_by_parent, existing_skus, upload_images)
        
        if product:
            transformed_products.append(product)
            image_count = len(product.get('images', []))
            if image_count > 0:
                products_with_images += 1
                total_images += image_count
            print(f"  ✅ {image_count} images")
        else:
            skipped_count += 1
            print(f"  ⏭️  Skipped (not published)")
    
    print(f"\n{'='*60}")
    print(f"✅ Transformed {len(transformed_products)} products")
    print(f"📸 {products_with_images} products with images ({total_images} total images)")
    print(f"⏭️  Skipped {skipped_count} non-published products")
    
    # Write to output file
    print(f"\n💾 Saving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(transformed_products, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Saved successfully!")
    
    return transformed_products

def generate_category_update_queries(products, output_file='category_updates.js'):
    """Generate MongoDB queries to update categories with product IDs"""
    
    category_products = {}
    
    # Group products by category
    for product in products:
        for cat_id in product.get('categories', []):
            if cat_id not in category_products:
                category_products[cat_id] = []
            category_products[cat_id].append(product['_id'])
    
    # Generate update queries
    queries = []
    for cat_id, product_ids in category_products.items():
        query = f'''db.categories.updateOne(
  {{ "_id": ObjectId("{cat_id}") }},
  {{ $set: {{ "products": {json.dumps(product_ids)} }} }}
);'''
        queries.append(query)
    
    # Write to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('// MongoDB Category Update Queries\n')
        f.write('// Run in MongoDB shell or MongoDB Compass\n\n')
        f.write('\n\n'.join(queries))
    
    print(f"\n📝 Category update queries saved to {output_file}")
    print(f"🔢 Generated {len(queries)} queries for {len(category_products)} categories")

# Main execution
if __name__ == '__main__':
    print("="*60)
    print("  WordPress to MongoDB Product Transformer")
    print("  (with post_parent image linking)")
    print("="*60 + "\n")
    
    # Configuration
    INPUT_FILE = 'wordpress_products.json'
    ATTACHMENTS_CSV = 'post_parents.csv'  # Your CSV filename
    OUTPUT_FILE = 'mongodb_products.json'
    UPLOAD_IMAGES = False  # Set to True to upload to Cloudinary
    
    # Transform products
    products = process_products_file(INPUT_FILE, ATTACHMENTS_CSV, OUTPUT_FILE, upload_images=UPLOAD_IMAGES)
    
    # Generate category update queries
    generate_category_update_queries(products)
    
    print("\n" + "="*60)
    print("✅ DONE! Next steps:")
    print("="*60)
    print("1. Import products:")
    print("   mongoimport --db shira-studio --collection products --file mongodb_products.json --jsonArray")
    print("\n2. Run category updates:")
    print("   mongosh shira-studio < category_updates.js")
    print("="*60 + "\n")