/**
 * PN Scripts Tabcrest: remember a dismissed notice when its close button is used.
 *
 * @package Pnscripts\ProductTabs
 */
( function () {
	'use strict';

	document.addEventListener( 'click', function ( event ) {
		var button = event.target.closest( '.notice-dismiss' );
		var notice = button ? button.closest( '[data-pnscripts-pt-dismiss]' ) : null;
		if ( ! notice ) {
			return;
		}
		window.fetch( notice.getAttribute( 'data-pnscripts-pt-dismiss' ), { credentials: 'same-origin' } );
	} );
} )();
