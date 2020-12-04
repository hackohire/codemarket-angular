#!/bin/bash
aws s3 rm s3://vivek-jti-frontend --recursive

for old in dist/browser/*.gz; do mv $old ${old%%.gz*}; done
aws s3 sync dist/browser/ s3://vivek-jti-frontend --metadata-directive REPLACE --cache-control max-age=31536000,public --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" || { echo 'ERROR: s3 sync failed' ; exit 1; }
aws s3 sync dist/browser/ s3://vivek-jti-frontend --metadata-directive REPLACE --cache-control max-age=31536000,public --acl public-read --exclude "*" --include "*.css" --include "*.js" --content-encoding gzip || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
aws s3 cp dist/browser/index.html s3://vivek-jti-frontend/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read --content-encoding gzip || { echo 'ERROR: s3 cp index failed' ; exit 1; }
