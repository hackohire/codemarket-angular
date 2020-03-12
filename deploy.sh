
#/bin/bash

aws s3 rm s3://joel-frontend --recursive

#upload files
aws s3 cp ./dist/joel/ s3://joel-frontend --recursive