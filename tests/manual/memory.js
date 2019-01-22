/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals console:false, document, window */

import BalloonEditor from '../../src/ballooneditor';
import ArticlePluginSet from '@ckeditor/ckeditor5-core/tests/_utils/articlepluginset';

window.editors = {};

/*
 * Memory-leak safe version of balloon editor manual test does not:
 * - define global variables (such as let editor; in main file scope)
 * - console.log() objects
 * - add event listeners with () => {} methods which reference other
 */
function initEditors() {
	init( '#editor-1' );
	init( '#editor-2' );

	document.getElementById( 'destroyEditors' ).addEventListener( 'click', destroyEditors );

	function init( selector ) {
		BalloonEditor
			.create( document.querySelector( selector ), {
				plugins: [ ArticlePluginSet ],
				toolbar: {
					items: [
						'heading',
						'|',
						'bold',
						'italic',
						'link',
						'bulletedList',
						'numberedList',
						'blockQuote',
						'insertTable',
						'mediaEmbed',
						'undo',
						'redo'
					]
				},
				image: {
					toolbar: [
						'imageStyle:full',
						'imageStyle:side',
						'|',
						'imageTextAlternative'
					]
				},
				table: {
					contentToolbar: [
						'tableColumn',
						'tableRow',
						'mergeTableCells'
					]
				}
			} )
			.then( editor => {
				window.editors[ selector ] = editor;
			} )
			.catch( err => {
				console.error( err.stack );
			} );
	}

	function destroyEditors() {
		for ( const selector in window.editors ) {
			window.editors[ selector ].destroy().then( () => {
				window.editors[ selector ] = undefined;
			} );
		}

		document.getElementById( 'destroyEditors' ).removeEventListener( 'click', destroyEditors );
	}
}

document.getElementById( 'initEditors' ).addEventListener( 'click', initEditors );
