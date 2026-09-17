import os
import shutil
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, 'assets', 'images')
BACKUP_DIR = os.path.join(IMAGES_DIR, '_originals')

def get_max_dim(rel_path):
    p = rel_path.lower().replace('\\', '/')
    if 'directors' in p:
        return 320
    elif 'speakers' in p:
        return 600
    elif 'organizations' in p:
        return 360
    elif 'sponsors' in p:
        return 800
    elif 'venue' in p:
        return 1200
    return 1000

def optimize_all():
    print(f"Base directory: {BASE_DIR}")
    print(f"Scanning images in: {IMAGES_DIR}")

    total_before = 0
    total_after = 0
    converted_count = 0

    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR, exist_ok=True)

    for root, dirs, files in os.walk(IMAGES_DIR):
        if '_originals' in root:
            continue
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext not in ['.jpg', '.jpeg', '.png', '.jfif', '.webp', '.mpo', '']:
                continue
            
            src_path = os.path.join(root, f)
            if not os.path.isfile(src_path):
                continue

            rel_from_images = os.path.relpath(src_path, IMAGES_DIR)
            backup_path = os.path.join(BACKUP_DIR, rel_from_images)
            os.makedirs(os.path.dirname(backup_path), exist_ok=True)

            if not os.path.exists(backup_path):
                shutil.copy2(src_path, backup_path)

            file_size = os.path.getsize(src_path)
            total_before += file_size

            try:
                with Image.open(src_path) as img:
                    orig_w, orig_h = img.size
                    max_dim = get_max_dim(rel_from_images)
                    ratio = min(1.0, max_dim / max(orig_w, orig_h))
                    new_w = max(1, int(orig_w * ratio))
                    new_h = max(1, int(orig_h * ratio))

                    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                    
                    base_name = os.path.splitext(f)[0]
                    webp_path = os.path.join(root, f"{base_name}.webp")

                    has_alpha = resized.mode in ('RGBA', 'LA') or (resized.mode == 'P' and 'transparency' in resized.info)
                    if not has_alpha and resized.mode != 'RGB':
                        resized = resized.convert('RGB')
                    
                    resized.save(webp_path, format='WEBP', quality=82, method=6)
                    opt_size = os.path.getsize(webp_path)
                    total_after += opt_size
                    converted_count += 1
                    print(f"[OK] {rel_from_images} -> {os.path.basename(webp_path)}: {file_size/1024:.1f}KB -> {opt_size/1024:.1f}KB ({orig_w}x{orig_h} -> {new_w}x{new_h})")
            except Exception as e:
                print(f"[ERR] Could not process {src_path}: {e}")
                total_after += file_size

    print("=" * 60)
    print(f"Total processed: {converted_count} images")
    print(f"Initial total: {total_before / (1024*1024):.2f} MB")
    print(f"Optimized total: {total_after / (1024*1024):.2f} MB")
    if total_before > 0:
        savings = ((total_before - total_after) / total_before) * 100
        print(f"Net bandwidth savings: {savings:.1f}%")

if __name__ == '__main__':
    optimize_all()
