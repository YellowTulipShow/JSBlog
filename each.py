# coding: UTF-8
import io, os, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')

import re

def get_all_file_paths(root, ignores=[]):
    file_paths = []
    if os.path.isfile(root):
        file_paths.append(root)
        return file_paths
    if not os.path.isdir(root):
        return file_paths
    folders = os.listdir(root)
    def is_ignore(folder):
        if ignores == None or len(ignores) <= 0:
            return False
        for ig in ignores:
            if re.search(ig, folder):
                return True
        return False
    for folder in folders:
        if is_ignore(folder):
            continue
        path = os.path.join(root, folder)
        son_paths = get_all_file_paths(path)
        file_paths.extend(son_paths)
    return file_paths

def trimStart(vstr, symbol=r'\s+'):
    vstr = str(vstr)
    vstr = re.sub(r"^" + symbol, "", vstr)
    return vstr

def trimEnd(vstr, symbol=r'\s+'):
    vstr = str(vstr)
    vstr = re.sub(symbol + r"$", "", vstr)
    return vstr

def trim(vstr, symbol=r'\s+'):
    vstr = trimStart(vstr, symbol=symbol)
    vstr = trimEnd(vstr, symbol=symbol)
    return vstr

def main():
    paths = get_all_file_paths(".", ignores=[r'\.git'])
    for path in paths:
        path = path.replace('\\', '/')
        path = trim(path, symbol=r'\.')
        print(path)

if __name__ == '__main__':
    main()
