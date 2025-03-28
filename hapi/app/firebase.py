import os
import json
import base64
import firebase_admin
from firebase_admin import credentials

if os.environ.get('AWS_LAMBDA_FUNCTION_NAME') is not None:
    firebase_creds_b64 = os.environ.get('FIREBASE_SERVICE_ACCOUNT_B64')
    creds_json = base64.b64decode(firebase_creds_b64).decode('utf-8')
    cred_dict = json.loads(creds_json)
    cred = credentials.Certificate(cred_dict)

else:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    service_account_path = os.path.join(
        current_dir, 'firebase-service-account.json')
    cred = credentials.Certificate(service_account_path)

firebase_app = firebase_admin.initialize_app(cred)
