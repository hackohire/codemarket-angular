import Storage from '@aws-amplify/storage';
import { environment } from '../../environments/environment';
import { appConstants } from '../shared/constants/app_constants';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class MyStorageProvider {

    constructor() {
    }

    static get title() {
        return 'MyStorageProvider';
    }
    async uploadFile(storage, file, fileName, dir, evt, url, options) {
        console.log(storage, file, fileName, dir, evt, url, options);
        const fileNameSplitArray = fileName.split('.');
        const fileExt = fileNameSplitArray.pop();
        const uniquefileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;
        return Storage.vault.put(uniquefileName, file, {
            bucket: appConstants.fileS3Bucket,
            level: 'public',
            contentType: file.type,
        }).then((uploaded: any) => {
            console.log('uploaded', uploaded);
            return { default: environment.s3FilesBucketURL + uploaded.key };
        });
    }
    async deleteFile(fileInfo) {
        //do something
    }
    async downloadFile(fileInfo, options) {
    }
}
