# coding: UTF-8
import io, os, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')

import re
import file
import convert

def ignores_filepaths():
    return [
        r'\.git$',
        r'__pycache__',
    ]

def main():
    urls = []
    ignores = ignores_filepaths();
    allfilepaths = file.get_all_file_paths("../", ignores=ignores)
    for filepath in allfilepaths:
        filepath = convert.trimStart(filepath, symbol=r'\.+/*')
        urls.append({
            "path": filepath,
        })
        # print(filepath)
    urlspath = file.to_abs_path('../.jsblog.configs/', 'urls.json')
    urlspath = file.config_json_file_write(urlspath, urls)
    print('urlspath:', urlspath)

if __name__ == '__main__':
    main()
