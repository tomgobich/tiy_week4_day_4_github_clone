'use strict';

$(document).ready(function () {

	var $profileTabs = $('.profile-tabs');

	// 
	$profileTabs.on('click', function () {

		// Capture clicked element
		var self = $(this);

		// Remove active state from previous tab
		$profileTabs.removeClass('active');

		// Hide previously active tab
		$('#dataLists').children().css('display', 'none');

		// Add active class to clicked element
		self.addClass('active');

		// Get data-content value from clicked tab
		var dataElement = self.data('content');

		// Make element associated with tab display block
		$('#' + dataElement).css('display', 'block');
	});
});