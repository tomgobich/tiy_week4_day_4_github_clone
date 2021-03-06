$(document).ready(function() {

	// Build Repository List
	var Repositories = (function() {

		var repositoryList = [];
		var Repository = function() {};

		// Make AJAX call for GitHub Repositories
		var getRepositories = function() {

			$.ajax({
				url: 'https://api.github.com/users/tomgobich/repos',
				success: function(resp) {
					setupRepositoryData(resp);
				}
			});

		}

		// Put the data into an object, and push object to array
		var setupRepositoryData = function(data) {

			data.forEach(function(repo, index) {
				let repository = new Repository();

				repository.id 			= repo.id;
				repository.name 		= repo.name;
				repository.url 			= repo.html_url;
				repository.description 	= repo.description;
				repository.updated 		= repo.updated_at;
				repository.language 	= repo.language;
				repository.starCount 	= repo.stargazers_count;

				repositoryList.push(repository);

			});

			// Get branch count for each repository, separate API call
			getRepositoryBranchCount();

		}

		// Make GitHub Repository Branch call
		var getRepositoryBranchCount = function() {

			repositoryList.forEach(function(repository) {

				$.ajax({
					url: `https://api.github.com/repos/tomgobich/${repository.name}/branches`,
					success: function(resp) {
						// Set response length to branchCount in repository array
						repository.branchCount = resp.length;

						// Display the repository data
						displayRepositoryData(repository);
					}
				});

			});

		}

		// Display the repository data (called within loop)
		var displayRepositoryData = function(repository) {

			let repositoryElement =
				`<div class="repository">
					<div class="repository-left">
						<h3 class="repository-name"><a href="${repository.url}">${repository.name}</a></h3>
						<p class="repository-about">${repository.description}</p>
						<p class="repository-update">${moment(repository.updated).from()}</p>
					</div>
					<div class="repository-right">
						<h4 class="repository-type">${repository.language}</h4>
						<a href="${repository.url}/stargazers">
							<span class="octicon octicon-star"></span>
							<h4 class="repository-stars">${repository.starCount}</h4>
						</a>
						<a href="${repository.url}/branches">
							<span class="octicon octicon-git-branch"></span>
							<h4 class="repository-branches">${repository.branchCount}</h4>
						</a>
					</div>
				 </div>`;

			$('#repositoryListing').append(repositoryElement);

		}

		return {
			buildRepositoryList: getRepositories
		}

	})();

	// Build Activity List
	var Activity = (function() {

		var activityList = [];
		var Activity = function() {};

		// Make AJAX call for GitHub Repositories
		var getActivities = function() {

			$.ajax({
				url: 'https://api.github.com/users/tomgobich/events',
				success: function(resp) {
					setupActivityData(resp);
				}
			});

		}

		// Put the data into an object, and push object to array
		var setupActivityData = function(data) {

			data.forEach(function(activityData, index) {

				let activity = new Activity();

				activity.id 				= activityData.id;
				activity.type 				= activityData.type;
				activity.date				= activityData.created_at;

				activity.actorUsername 		= activityData.actor.login;
				activity.actorAvatar 		= activityData.actor.avatar_url;
				activity.actorUrl			= 'https://github.com/' + activity.actorUsername;

				activity.repositoryName 	= activityData.repo.name;
				activity.repositoryUrl		= _.replace(activityData.repo.url, 'api.', '');
				activity.repositoryUrl		= _.replace(activity.repositoryUrl, 'repos/', '');

				// Event type PushEvent?
				if(activityData.type === "PushEvent") {

					// Yes, add the following data
					activity.commitBranch	= _.replace(activityData.payload.ref, 'refs/heads/', '');
					activity.commitSha		= activityData.payload.commits[0].sha;
					activity.commitSha 		= activity.commitSha.substring(0, 7);
					activity.commitMessage	= activityData.payload.commits[0].message;
					activity.commitUrl		= activity.repositoryUrl + '/commits/' + activityData.payload.head;

				}
				// Event type CreateEvent?
				else if(activityData.type === "CreateEvent") {

					// Yes, add the following data
					activity.createType 	= activityData.payload.ref_type;
					activity.description 	= activityData.payload.description;

					// Create type branch?
					if( activity.createType === "branch") {

						// Yes, add the following data
						activity.branch 	= activityData.payload.ref;

					}

				}

				// Push to array
				activityList.push(activity);

			});

			// Display the data
			displayActivityData();

		}

		// Handle displaying the activity data
		var displayActivityData = function() {

			let activityElement = '';

			// Loop through activities
			activityList.forEach(function(activity, index) {

				// PushEvent?
				if(activity.type === "PushEvent") {

					// Yes, display a push event block
					activityElement += buildPushEvent(activity);

				}
				// Create Event?
				else if(activity.type === "CreateEvent") {

					// Yes, but is it a repository?
					if(activity.createType === "repository") {

						// Yes, display a repository block
						activityElement += buildCreateRepositoryEvent(activity);

					}
					// Yes, but is it a branch?
					else if(activity.createType === "branch") {

						// Yes, display a branch block
						activityElement += buildCreateBranchEvent(activity);

					}
					
				}

			});

			// Append to activityListing
			$('#activityListing').append(activityElement);

		}

		// Display the repository data (called within loop)
		var buildPushEvent = function(activity) {

			let pushElement =
				`<div class="activity">
					<div class="activity-icon">
						<span class="mega-octicon octicon-git-commit"></span>
					</div>
					<div class="activity-body">
						<p class="time-since">${moment(activity.date).fromNow()}</p>
						<h4 class="activity-title">
							<a href="${activity.actorUrl}">${activity.actorUsername}</a> pushed to 
							<a href="${activity.commitUrl}">${activity.commitBranch}</a> at 
							<a href="${activity.repositoryUrl}">${activity.repositoryName}</a>
						</h4>
						<div class="activity-description">
							<img class="user-repo" src="${activity.actorAvatar}" alt="${activity.actorUsername}">
							<img class="last-user" src="${activity.actorAvatar}" alt="${activity.actorUsername}">
							<p><a href="${activity.commitUrl}">${activity.commitSha}</a> ${activity.commitMessage}</p>
						</div>
					</div>
				 </div>`;

			return pushElement;

		}

		// Display the repository data (called within loop)
		var buildCreateRepositoryEvent = function(activity) {

			let createElement =
				`<div class="activity">
					<div class="activity-icon">
						<span class="mega-octicon octicon-repo"></span>
					</div>
					<div class="activity-body">
						<p class="time-since">${moment(activity.date).fromNow()}</p>
						<h4 class="activity-title">
							<a href="${activity.actorUrl}">${activity.actorUsername}</a> created new repository  
							<a href="${activity.repositoryUrl}">${activity.repositoryName}</a>
						</h4>
						<div class="activity-description">
							<img class="last-user" src="${activity.actorAvatar}" alt="${activity.actorUsername}">
							<p>${activity.description}</p>
						</div>
					</div>
				 </div>`;

			return createElement;

		}

		// Display the repository data (called within loop)
		var buildCreateBranchEvent = function(activity) {

			let createElement =
				`<div class="activity">
					<div class="activity-icon">
						<span class="mega-octicon octicon-git-branch"></span>
					</div>
					<div class="activity-body">
						<p class="time-since">${moment(activity.date).fromNow()}</p>
						<h4 class="activity-title">
							<a href="${activity.actorUrl}">${activity.actorUsername}</a> created new branch 
							<a href="${activity.repositoryUrl}">${activity.branch}</a> at  
							<a href="${activity.repositoryUrl}">${activity.repositoryName}</a>
						</h4>
						<div class="activity-description">
							<img class="last-user" src="${activity.actorAvatar}" alt="${activity.actorUsername}">
							<p>${activity.description}</p>
						</div>
					</div>
				 </div>`;

			return createElement;

		}

		return {

			buildActivityList: getActivities

		}

	})();



	// Initialize data calls
	Repositories.buildRepositoryList();
	Activity.buildActivityList();

});