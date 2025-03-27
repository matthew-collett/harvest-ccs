import os
from tinydb import TinyDB


def db_path():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if os.environ.get('AWS_EXECUTION_ENV'):
        return '/tmp/state.json'
    return os.path.join(current_dir, '../..', 'tinydb', 'state.json')


db = TinyDB(db_path())
