import os
import json
import firebase_admin
from firebase_admin import credentials


if os.environ.get('AWS_LAMBDA_FUNCTION_NAME') is not None:
    cred_dict = json.loads(os.environ.get('FIREBASE_SERVICE_ACCOUNT'))
    cred = credentials.Certificate(cred_dict)
else:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    service_account_path = os.path.join(
        current_dir, 'firebase-service-account.json')
    cred = credentials.Certificate(service_account_path)

# Initialize Firebase with the appropriate credentials
firebase_app = firebase_admin.initialize_app(cred)
