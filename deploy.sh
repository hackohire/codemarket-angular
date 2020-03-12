
#/bin/bash

aws s3 rm s3://medighee-frontend --recursive

#upload files
aws s3 cp ./dist/medighee/ s3://medighee-frontend --recursive