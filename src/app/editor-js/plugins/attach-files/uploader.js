/**
 * Module for file uploading.
 */
export default class Uploader {
  /**
   * @param {Object} config
   * @param {function} onUpload - callback for successful file upload
   * @param {function} onError - callback for uploading errors
   */
  constructor({ config, onUpload, onError }) {
    this.config = config;
    this.onUpload = onUpload;
    this.onError = onError;
  }

  /**
   * Create an ephemeral input file field and return chosen files array
   *
   * @param {transportParams} config
   * @return {Promise<FileList>}
   */
  selectFiles(config = {}) {
    return new Promise((resolve, reject) => {
      /**
       * Create a new INPUT element
       * @type {HTMLElement}
       */
      let inputElement = document.createElement('INPUT');

      /**
       * Set a 'FILE' type for this input element
       * @type {string}
       */
      inputElement.type = 'file';

      if (config.multiple) {
        inputElement.setAttribute('multiple', 'multiple');
      }

      if (config.accept) {
        inputElement.setAttribute('accept', config.accept);
      }

      /**
       * Do not show element
       */
      inputElement.style.display = 'none';

      /**
       * Append element to the body
       * Fix using module on mobile devices
       */
      document.body.appendChild(inputElement);

      /**
       * Add onchange listener for «choose file» pop-up
       */
      inputElement.addEventListener('change', event => {
        /**
         * Get files from input field
         */
        const files = event.target.files;

        /**
         * Return ready to be uploaded files array
         */
        resolve(files);

        /**
         * Remove element from a DOM
         */
        document.body.removeChild(inputElement);
      }, false);

      /**
       * Fire click event on «input file» field
       */
      inputElement.click();
    });
  };

  /**
   * Handle clicks on the upload file button
   * @fires ajax.transport()
   * @param {function} onPreview - callback fired when preview is ready
   */
  uploadSelectedFile({ onPreview }) {
    const preparePreview = function (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (e) => {
        onPreview(e.target.result);
      };
    };

    /**
     * Custom uploading
     * or default uploading
     */
    let upload;

    // custom uploading
    if (this.config.uploader && typeof this.config.uploader.uploadByFile === 'function') {
      upload = this.selectFiles({ accept: this.config.types }).then((files) => {
        preparePreview(files[0]);

        const customUpload = this.config.uploader.uploadByFile(files[0]);

        if (!isPromise(customUpload)) {
          console.warn('Custom uploader method uploadByFile should return a Promise');
        }

        return customUpload;
      })

    // default uploading
    } else {
      ajax.transport({
        url: this.config.endpoint,
        accept: this.config.types,
        beforeSend: () => onPreview(),
        fieldName: this.config.field
      }).then((response) => {
        this.onUpload(response);
      }).catch((error) => {
        const message = (error && error.message) ? error.message : this.config.errorMessage;
  
        this.onError(message);
      });
    }

    upload.then((response) => {
      this.onUpload(response);
    }).catch((error) => {
      this.onError(error);
    });
  }
}

/**
 * Check if passed object is a Promise
 * @param  {*}  object - object to check
 * @return {Boolean}
 */
function isPromise(object) {
  return Promise.resolve(object) === object;
}

