
#/bin/bash

aws s3 rm s3://codemarket-frontend --recursive

#upload files
aws s3 cp ./dist/codemarket/ s3://codemarket-frontend --recursive