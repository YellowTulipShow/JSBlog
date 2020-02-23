# coding: UTF-8
import io, os, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')

import re
import file
import convert

def main():
    config = file.read_program_config_DevelopToRelease(
        release_file_name = '.config.release.json',
        develop_file_name = '.config.develop.json')
    global_ignores = config.get('ignores', [])
    for project in config.get('projects', []):
        generate_project_directory(project, global_ignores=global_ignores)

def generate_project_directory(project, global_ignores=[]):
    project_path = project.get('path', None)
    if not project_path:
        return
    os.chdir(project_path)
    urls = []
    ignores = project.get('ignores', [])
    ignores.extend(global_ignores)
    def is_ignore(folder):
        if ignores == None or len(ignores) <= 0:
            return False
        for ig in ignores:
            if re.search(ig, folder, re.M|re.I):
                return True
        return False
    allfilepaths = file.get_all_file_paths('./', is_ignore=is_ignore)
    for filepath in allfilepaths:
        filepath = convert.trimStart(filepath, symbol=r'[^\/]+')
        urls.append({
            "path": filepath,
        })
    urlspath = file.to_abs_path('.jsblog.configs/', 'urls.json')
    urlspath = file.config_json_file_write(urlspath, urls)
    print('urlspath:', urlspath)

if __name__ == '__main__':
    main()
