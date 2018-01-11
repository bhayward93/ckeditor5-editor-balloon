/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module editor-balloon/ballooneditor
 */

import Editor from '@ckeditor/ckeditor5-core/src/editor/editor';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';
import ContextualToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/contextual/contextualtoolbar';
import BalloonEditorUI from './ballooneditorui';
import BalloonEditorUIView from './ballooneditoruiview';
import setDataInElement from '@ckeditor/ckeditor5-utils/src/dom/setdatainelement';
import DataInterface from '@ckeditor/ckeditor5-core/src/editor/utils/datainterface';
import ElementInterface from '@ckeditor/ckeditor5-core/src/editor/utils/elementinterface';
import attachToForm from '@ckeditor/ckeditor5-core/src/editor/utils/attachtoform';
import mix from '@ckeditor/ckeditor5-utils/src/mix';

/**
 * The {@glink builds/guides/overview#Balloon-editor balloon editor} implementation (Medium-like editor).
 * It uses an inline editable and a toolbar based on the {@link module:ui/toolbar/contextual/contextualtoolbar~ContextualToolbar}.
 * See the {@glink examples/builds/balloon-editor demo}.
 *
 * In order to create a balloon editor instance, use the static
 * {@link module:editor-balloon/ballooneditor~BalloonEditor#create `BalloonEditor.create()`} method.
 *
 * # Balloon editor and balloon build
 *
 * The balloon editor can be used directly from source (if you installed the
 * [`@ckeditor/ckeditor5-editor-balloon`](https://www.npmjs.com/package/@ckeditor/ckeditor5-editor-balloon) package)
 * but it is also available in the {@glink builds/guides/overview#Balloon-editor balloon build}.
 *
 * {@glink builds/guides/overview Builds} are ready-to-use editors with plugins bundled in. When using the editor from
 * source you need to take care of loading all plugins by yourself
 * (through the {@link module:core/editor/editorconfig~EditorConfig#plugins `config.plugins`} option).
 * Using the editor from source gives much better flexibility and allows easier customization.
 *
 * Read more about initializing the editor from source or as a build in
 * {@link module:editor-balloon/ballooneditor~BalloonEditor#create `BalloonEditor.create()`}.
 *
 * @mixes module:core/editor/utils/datainterface~DataInterface
 * @mixes module:core/editor/utils/elementinterface~ElementInterface
 * @implements module:core/editor/editorwithui~EditorWithUI
 * @extends module:core/editor/editor~Editor
 */
export default class BalloonEditor extends Editor {
	/**
	 * Creates an instance of the balloon editor.
	 *
	 * **Note:** do not use the constructor to create editor instances. Use the static
	 * {@link module:editor-balloon/ballooneditor~BalloonEditor#create `BalloonEditor.create()`} method instead.
	 *
	 * @protected
	 * @param {HTMLElement} element The DOM element that will be the source for the created editor
	 * (on which the editor will be initialized).
	 * @param {module:core/editor/editorconfig~EditorConfig} config The editor configuration.
	 */
	constructor( element, config ) {
		super( config );

		this.element = element;

		this.config.get( 'plugins' ).push( ContextualToolbar );
		this.config.define( 'contextualToolbar', this.config.get( 'toolbar' ) );

		this.data.processor = new HtmlDataProcessor();

		this.model.document.createRoot();

		this.ui = new BalloonEditorUI( this, new BalloonEditorUIView( this.locale, element ) );

		attachToForm( this );
	}

	/**
	 * Destroys the editor instance, releasing all resources used by it.
	 *
	 * Updates the original editor element with the data.
	 *
	 * @returns {Promise}
	 */
	destroy() {
		// Cache the data, then destroy.
		// It's safe to assume that the model->view conversion will not work after super.destroy().
		const data = this.getData();

		this.ui.destroy();

		return super.destroy()
			.then( () => setDataInElement( this.element, data ) );
	}

	/**
	 * Creates a balloon editor instance.
	 *
	 * Creating instance when using {@glink builds/index CKEditor build}:
	 *
	 *		BalloonEditor
	 *			.create( document.querySelector( '#editor' ) )
	 *			.then( editor => {
	 *				console.log( 'Editor was initialized', editor );
	 *			} )
	 *			.catch( err => {
	 *				console.error( err.stack );
	 *			} );
	 *
	 * Creating instance when using CKEditor from source (make sure to specify the list of plugins to load and the toolbar):
	 *
	 *		import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
	 *		import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
	 *		import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
	 *		import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
	 *		import ...
	 *
	 *		BalloonEditor
	 *			.create( document.querySelector( '#editor' ), {
	 *				plugins: [ Essentials, Bold, Italic, ... ],
	 *				toolbar: [ 'bold', 'italic', ... ]
	 *			} )
	 *			.then( editor => {
	 *				console.log( 'Editor was initialized', editor );
	 *			} )
	 *			.catch( err => {
	 *				console.error( err.stack );
	 *			} );
	 *
	 * @param {HTMLElement} element The DOM element that will be the source for the created editor
	 * (on which the editor will be initialized).
	 * @param {module:core/editor/editorconfig~EditorConfig} config The editor configuration.
	 * @returns {Promise} A promise resolved once the editor is ready.
	 * The promise returns the created {@link module:editor-balloon/ballooneditor~BalloonEditor} instance.
	 */
	static create( element, config ) {
		return new Promise( resolve => {
			const editor = new this( element, config );

			resolve(
				editor.initPlugins()
					.then( () => {
						editor.ui.init();
						editor.fire( 'uiReady' );
					} )
					.then( () => editor.loadDataFromElement() )
					.then( () => {
						editor.fire( 'dataReady' );
						editor.fire( 'ready' );
					} )
					.then( () => editor )
			);
		} );
	}
}

mix( BalloonEditor, DataInterface );
mix( BalloonEditor, ElementInterface );
