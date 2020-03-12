
#/bin/bash

aws s3 rm s3://jtinsurance-frontend --recursive

#upload files
aws s3 cp ./dist/jtinsurance/ s3://jtinsurance-frontend --recursive