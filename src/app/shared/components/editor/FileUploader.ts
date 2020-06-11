import {Storage} from '@aws-amplify/storage';
import { appConstants } from '../../constants/app_constants';
import { environment } from '../../../../environments/environment';


export class CustomUploadAdapter {
    loader;
    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }
    async upload() {
        const file = await this.loader.file;
        const fileNameSplitArray = file.name.split('.');
        const fileExt = fileNameSplitArray.pop();
        const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;
        return Storage.put(fileName, file, {
            bucket: environment.fileS3Bucket,
            level: 'public',
            contentType: file.type,
            progressCallback: (progress) => {
                console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
                this.loader.uploadTotal = progress.total;
                this.loader.uploaded = progress.loaded;
            },
        }).then((uploaded: any) => {
            console.log('uploaded', uploaded);
            return { default: environment.s3FilesBucketURL + uploaded.key };
        });
    }

    abort() {

    }
}
