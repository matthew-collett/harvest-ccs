import os
import json
import boto3
from tinydb import TinyDB
from tinydb.storages import Storage


class S3Storage(Storage):
    def __init__(self, bucket, key):
        self.s3 = boto3.client('s3')
        self.bucket = bucket
        self.key = key

    def read(self):
        try:
            response = self.s3.get_object(Bucket=self.bucket, Key=self.key)
            return json.loads(response['Body'].read().decode('utf-8'))
        except Exception:
            return {"_default": {}}

    def write(self, data):
        self.s3.put_object(
            Bucket=self.bucket,
            Key=self.key,
            Body=json.dumps(data)
        )


bucket_name = os.getenv('S3_BUCKET')
db = TinyDB(storage=S3Storage, bucket=bucket_name, key='tinydb/state.json')
