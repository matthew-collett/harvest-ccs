from flask import Flask


def create_app():
    app = Flask(__name__)

    from app.routes.state import state_bp
    app.register_blueprint(state_bp)

    from app import firebase

    return app
