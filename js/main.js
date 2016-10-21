$(document).ready(function() {

	// Build GitHub profile
	var Profile = (function() {

		var user = {};

		// Make API call to get user data from GitHub
		var getUserProfile = function() {
			$.ajax({
				url: 'https://api.github.com/users/tomgobich',
				success: function(resp) {
					setupUserData(resp);
				}
			});
		}

		// Load data from API call into user object
		var setupUserData = function(data) {
			user.id			= data.id;
			user.avatar 	= data.avatar_url;
			user.name		= data.name;
			user.username	= data.login;
			user.about		= data.bio;
			user.location	= data.location;
			user.email		= data.email;
			user.creation	= data.created_at;
			user.followers 	= data.followers;
			user.following 	= data.following;

			// Get user starred number & load it into object
			getUserStarData();
		}

		// Get user starred number & load it into object
		var getUserStarData = function() {
			$.ajax({
				url: 'https://api.github.com/users/tomgobich/starred',
				success: function(resp) {
					user.starred = resp.length;
					displayUserData();
				}
			})
		}

		// Append user data to DOM
		var displayUserData = function() {
			let $profileRow 	= $('#profileRow'),
				$profileInfo	= $('#profileInfo');

			// Detach #profileInfo element
			$profileInfo.detach();

			// Append profile sections to #profileInfo
			$profileInfo.append(Build.userInfo());
			$profileInfo.append(Build.userLinks());
			$profileInfo.append(Build.userStats());
			$profileInfo.append(Build.userOrganizations());

			// Attach #profileInfo back on DOM
			$profileRow.html($profileInfo);
		}

		// Build profile HTML elements
		var Build = (function() {

			// #userInfo section
			var buildUserInfo = function() {
				let userInfo =
					`<div id="userInfo" class="profile-section">
						<img id="avatar" class="avatar" src="${user.avatar}" alt="${user.name}">
						<h2 id="name" class="name">${user.name}</h2>
						<p id="username" class="username">${user.username}</p>
						<p id="about" class="about">${user.about}</p>		
					 </div>`;

				return userInfo;
			}

			// #userLinks section
			var buildUserLinks = function() {
				let userLinks =
					`<div id="userLinks" class="profile-section">
						<ul class="profile-links">
							<li><img class="icon location" src="images/octicons/svg/location.svg">${user.location}</li>
							<li><img class="icon email" src="images/octicons/svg/mail.svg"><a href="#">${user.email}</a></li>
							<li><img class="icon clock" src="images/octicons/svg/clock.svg">${user.creation}</li>
						</ul>
					 </div>`;

				return userLinks;
			}

			// #userStats section
			var buildUserStats = function() {
				let userStats = 
					`<div id="userStats" class="profile-section">
						<div class="activity-count">
							<h3 class="count"><a href="#">${user.followers}</a></h3>
							<p class="title">Followers</p>
						 </div>
						 <div class="activity-count">
							<h3 class="count"><a href="#">${user.starred}</a></h3>
							<p class="title">Starred</p>
						 </div>
						 <div class="activity-count">
							<h3 class="count"><a href="#">${user.following}</a></h3>
							<p class="title">Following</p>
						 </div>	
					 </div>`;

				return userStats;
			}

			// #userOrganization section
			var buildUserOrganizations = function() {
				let userOrganizations =
					`<div id="userOrganizations" class="profile-section">
						<h3 class="organization-title">Organizations</h3>
					 	<img class="organization" src="http://placehold.it/30x30">
					 </div>`;

				return userOrganizations;
			}

			// Make visible to parent the following:
			return {
				userInfo: buildUserInfo,
				userLinks: buildUserLinks,
				userStats: buildUserStats,
				userOrganizations: buildUserOrganizations
			}

		})();

		// Make visible to global the following:
		return {
			buildProfile: getUserProfile,
			userData: user
		}

	})();

	// Build profile
	Profile.buildProfile();

});