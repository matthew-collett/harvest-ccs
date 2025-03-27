from app.middlewares.auth import token_required
from flask import Blueprint, request, jsonify
import datetime
from app.store.db import db

state_bp = Blueprint('state', __name__, url_prefix='/state')


@state_bp.route('', methods=['POST'])
@token_required
def save_state():
    state = request.get_json()
    state['_last_updated'] = datetime.datetime.now().isoformat()
    db.truncate()
    db.insert(state)

    return jsonify({"status": "success"})


@state_bp.route('', methods=['GET'])
@token_required
def get_state():
    states = db.all()
    return jsonify(states[0] if states else {})
