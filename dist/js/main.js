'use strict';

$(document).ready(function () {

	// Build GitHub profile
	var Profile = function () {

		var user = {};

		// Make API call to get user data from GitHub
		var getUserProfile = function getUserProfile() {
			$.ajax({
				url: 'https://api.github.com/users/tomgobich',
				success: function success(resp) {
					setupUserData(resp);
				}
			});
		};

		// Load data from API call into user object
		var setupUserData = function setupUserData(data) {
			user.id = data.id;
			user.avatar = data.avatar_url;
			user.name = data.name;
			user.username = data.login;
			user.about = data.bio;
			user.location = data.location;
			user.email = data.email;
			user.creation = data.created_at;
			user.followers = data.followers;
			user.following = data.following;

			// Get user starred number & load it into object
			getUserStarData();
		};

		// Get user starred number & load it into object
		var getUserStarData = function getUserStarData() {
			$.ajax({
				url: 'https://api.github.com/users/tomgobich/starred',
				success: function success(resp) {
					user.starred = resp.length;
					displayUserData();
				}
			});
		};

		// Append user data to DOM
		var displayUserData = function displayUserData() {
			var $profileRow = $('#profileRow'),
			    $profileInfo = $('#profileInfo');

			// Detach #profileInfo element
			$profileInfo.detach();

			// Append profile sections to #profileInfo
			$profileInfo.append(Build.userInfo());
			$profileInfo.append(Build.userLinks());
			$profileInfo.append(Build.userStats());
			$profileInfo.append(Build.userOrganizations());

			// Attach #profileInfo back on DOM
			$profileRow.html($profileInfo);
		};

		// Build profile HTML elements
		var Build = function () {

			// #userInfo section
			var buildUserInfo = function buildUserInfo() {
				var userInfo = '<div id="userInfo" class="profile-section">\n\t\t\t\t\t\t<img id="avatar" class="avatar" src="' + user.avatar + '" alt="' + user.name + '">\n\t\t\t\t\t\t<h2 id="name" class="name">' + user.name + '</h2>\n\t\t\t\t\t\t<p id="username" class="username">' + user.username + '</p>\n\t\t\t\t\t\t<p id="about" class="about">' + user.about + '</p>\t\t\n\t\t\t\t\t </div>';

				return userInfo;
			};

			// #userLinks section
			var buildUserLinks = function buildUserLinks() {
				var userLinks = '<div id="userLinks" class="profile-section">\n\t\t\t\t\t\t<ul class="profile-links">\n\t\t\t\t\t\t\t<li><img class="icon location" src="images/octicons/svg/location.svg">' + user.location + '</li>\n\t\t\t\t\t\t\t<li><img class="icon email" src="images/octicons/svg/mail.svg"><a href="#">' + user.email + '</a></li>\n\t\t\t\t\t\t\t<li><img class="icon clock" src="images/octicons/svg/clock.svg">' + user.creation + '</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t </div>';

				return userLinks;
			};

			// #userStats section
			var buildUserStats = function buildUserStats() {
				var userStats = '<div id="userStats" class="profile-section">\n\t\t\t\t\t\t<div class="activity-count">\n\t\t\t\t\t\t\t<h3 class="count"><a href="#">' + user.followers + '</a></h3>\n\t\t\t\t\t\t\t<p class="title">Followers</p>\n\t\t\t\t\t\t </div>\n\t\t\t\t\t\t <div class="activity-count">\n\t\t\t\t\t\t\t<h3 class="count"><a href="#">' + user.starred + '</a></h3>\n\t\t\t\t\t\t\t<p class="title">Starred</p>\n\t\t\t\t\t\t </div>\n\t\t\t\t\t\t <div class="activity-count">\n\t\t\t\t\t\t\t<h3 class="count"><a href="#">' + user.following + '</a></h3>\n\t\t\t\t\t\t\t<p class="title">Following</p>\n\t\t\t\t\t\t </div>\t\n\t\t\t\t\t </div>';

				return userStats;
			};

			// #userOrganization section
			var buildUserOrganizations = function buildUserOrganizations() {
				var userOrganizations = '<div id="userOrganizations" class="profile-section">\n\t\t\t\t\t\t<h3 class="organization-title">Organizations</h3>\n\t\t\t\t\t \t<img class="organization" src="http://placehold.it/30x30">\n\t\t\t\t\t </div>';

				return userOrganizations;
			};

			// Make visible to parent the following:
			return {
				userInfo: buildUserInfo,
				userLinks: buildUserLinks,
				userStats: buildUserStats,
				userOrganizations: buildUserOrganizations
			};
		}();

		// Make visible to global the following:
		return {
			buildProfile: getUserProfile,
			userData: user
		};
	}();

	// Build profile
	Profile.buildProfile();
});