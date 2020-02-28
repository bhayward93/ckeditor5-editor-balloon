/**
 * Adapter for file uploads.
 */
export default class Adapter {
	/**
	 * Constructor.
	 * @param { Loader } loader - the loader object
	 * @param { Function } callback - callback to upload the media.
	 */
	constructor( loader, callback ) {
		this.loader = loader;
		this.callback = callback;
	}

	/**
	 *	Returns a promise that must contain a link to the uploaded image.
	 */
	upload() {
		return new Promise( ( resolve, reject ) => {
			resolve( this._sendRequest() );
			reject( null );
		} );
	}

	/**
	 * Invokes callback function, passing the file in the uploader.
	 */
	async _sendRequest() {
		const response = this.callback && this.callback( await this.loader.file );
		return {
			default: await response
		};
	}
}
