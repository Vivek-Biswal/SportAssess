import os
import re

def resolve_conflicts_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<<<<<<< HEAD' not in content:
        return

    print(f"Resolving conflicts in {filepath}")
    
    # Regex to match the entire conflict block and replace with just the HEAD part
    # Pattern: 
    # <<<<<<< HEAD\n
    # (HEAD content)
    # =======\n
    # (Other content)
    # >>>>>>> (hash)\n
    
    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [a-f0-9]+\n', re.DOTALL)
    new_content = pattern.sub(r'\1\n', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    frontend_dir = r"c:\Users\Lenovo\OneDrive\Desktop\GitHub\SportAssess\frontend\src"
    for root, dirs, files in os.walk(frontend_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                resolve_conflicts_in_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
