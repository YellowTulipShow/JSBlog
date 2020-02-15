# coding: UTF-8

import re
import sys
import os

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

def __test_trim():
    test_str_trim = '  22 55 00 33  '
    print('trimStart: "{str}"'.format(str=trimStart(test_str_trim)))
    print('trimEnd: "{str}"'.format(str=trimEnd(test_str_trim)))
    print('trim: "{str}"'.format(str=trim(test_str_trim)))
    test_str_trim = '14%@22 55 00 3314%@'
    print('trimStart: "{str}"'.format(str=trimStart(test_str_trim, symbol=r'14%@')))
    print('trimEnd: "{str}"'.format(str=trimEnd(test_str_trim, symbol=r'14%@')))
    print('trim: "{str}"'.format(str=trim(test_str_trim)))

def copy_dict(dict_old, dict_new):
    r = dict_old
    for key in dict_new:
        v = dict_new[key]
        if 'dict' in str(type(v)):
            ov = r.get(key, None)
            if ov:
                r[key] = copy_dict(ov, v)
            else:
                r[key] = copy_dict({}, v)
        else:
            r[key] = v
    return r

def __test_copy_dict():
    dict_old = {}
    dict_new = {
        'a': 1,
        'b': 2,
        'c': {
            'e': 555,
        }
    }
    copy_dict(dict_old, dict_new)
    print(dict_old)
    dict_new = {
        'a': 3,
        'b': 4,
        'c': {
            'd': 22,
        },
    }
    copy_dict(dict_old, dict_new)
    print(dict_old)
    dict_new = {
        'a': 5,
        'c': {
            'e': 666,
        },
    }
    copy_dict(dict_old, dict_new)
    print(dict_old)

if __name__ == '__main__':
    __test_trim()
    __test_copy_dict()
