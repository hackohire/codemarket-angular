
#/bin/bash

aws s3 rm s3://jane-frontend --recursive

#upload files
aws s3 cp ./dist/jane/ s3://jane-frontend --recursive