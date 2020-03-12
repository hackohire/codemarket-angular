
#/bin/bash

aws s3 rm s3://dro-frontend --recursive

#upload files
aws s3 cp ./dist/dro/ s3://dro-frontend --recursive