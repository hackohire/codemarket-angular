
#/bin/bash

aws s3 rm s3://amber-frontend --recursive

#upload files
aws s3 cp ./dist/amber/ s3://amber-frontend --recursive