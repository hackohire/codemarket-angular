
#/bin/bash

aws s3 rm s3://vivek-jti-frontend --recursive

#upload files
aws s3 cp ./dist/jtinsurance/ s3://vivek-jti-frontend --recursive