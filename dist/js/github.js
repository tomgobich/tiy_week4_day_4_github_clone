'use strict';

$(document).ready(function () {

	// Build Repository List
	var Repositories = function () {

		var repositoryList = [];
		var Repository = function Repository() {};

		// Make AJAX call for GitHub Repositories
		var getRepositories = function getRepositories() {
			$.ajax({
				url: 'https://api.github.com/users/tomgobich/repos',
				success: function success(resp) {
					setupRepositoryData(resp);
				}
			});
		};

		// Put the data into an object, and push object to array
		var setupRepositoryData = function setupRepositoryData(data) {
			data.forEach(function (repo, index) {
				var repository = new Repository();

				repository.id = repo.id;
				repository.name = repo.name;
				repository.url = repo.html_url;
				repository.description = repo.description;
				repository.updated = repo.updated_at;
				repository.language = repo.language;
				repository.starCount = repo.stargazers_count;

				repositoryList.push(repository);
			});

			// Get branch count for each repository, separate API call
			getRepositoryBranchCount();
		};

		// Make GitHub Repository Branch call
		var getRepositoryBranchCount = function getRepositoryBranchCount() {
			repositoryList.forEach(function (repository) {
				$.ajax({
					url: 'https://api.github.com/repos/tomgobich/' + repository.name + '/branches',
					success: function success(resp) {
						// Set response length to branchCount in repository array
						repository.branchCount = resp.length;

						// Display the repository data
						displayRepositoryData(repository);
					}
				});
			});
		};

		// HTML block removed from Repo listing
		// <div class="repository-fork">
		// 	<img src="images/octicons/svg/repo-forked.svg">
		// 	<p>forked from <a href="#">theironyard/js-assginments</a></p>
		// </div>

		// Display the repository data (called within loop)
		var displayRepositoryData = function displayRepositoryData(repository) {
			var repositoryElement = '<div class="repository">\n\t\t\t\t\t<div class="repository-left">\n\t\t\t\t\t\t<h3 class="repository-name"><a href="' + repository.url + '">' + repository.name + '</a></h3>\n\t\t\t\t\t\t<p class="repository-about">' + repository.description + '</p>\n\t\t\t\t\t\t<p class="repository-update">' + moment(repository.updated).from() + '</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="repository-right">\n\t\t\t\t\t\t<h4 class="repository-type">' + repository.language + '</h4>\n\t\t\t\t\t\t<a href="' + repository.url + '/stargazers">\n\t\t\t\t\t\t\t<img src="images/octicons/svg/star.svg">\n\t\t\t\t\t\t\t<h4 class="repository-stars">' + repository.starCount + '</h4>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a href="' + repository.url + '/branches">\n\t\t\t\t\t\t\t<img src="images/octicons/svg/git-branch.svg">\n\t\t\t\t\t\t\t<h4 class="repository-branches">' + repository.branchCount + '</h4>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t </div>';

			$('#repositoryListing').append(repositoryElement);
		};

		return {
			buildRepositoryList: getRepositories
		};
	}();

	// Build Activity List
	var Activity = function () {

		var activityList = [];
		var Activity = function Activity() {};

		// Make AJAX call for GitHub Repositories
		var getActivities = function getActivities() {
			$.ajax({
				url: 'https://api.github.com/users/tomgobich/events',
				success: function success(resp) {
					setupActivityData(resp);
				}
			});
		};

		// Put the data into an object, and push object to array
		var setupActivityData = function setupActivityData(data) {
			data.forEach(function (activityData, index) {
				var activity = new Activity();

				activity.id = activityData.id;
				activity.type = activityData.type;
				activity.date = activityData.created_at;

				activity.actorUsername = activityData.actor.login;
				activity.actorAvatar = activityData.actor.avatar_url;
				activity.actorUrl = 'https://github.com/' + activity.actorUsername;

				activity.repositoryName = activityData.repo.name;
				activity.repositoryUrl = _.replace(activityData.repo.url, 'api.', '');
				activity.repositoryUrl = _.replace(activity.repositoryUrl, 'repos/', '');

				if (activityData.type === "PushEvent") {
					activity.commitBranch = _.replace(activityData.payload.ref, 'refs/heads/', '');
					activity.commitSha = activityData.payload.commits[0].sha;
					activity.commitSha = activity.commitSha.substring(0, 7);
					activity.commitMessage = activityData.payload.commits[0].message;
					activity.commitUrl = activity.repositoryUrl + '/commits/' + activityData.payload.head;
				} else if (activityData.type === "CreateEvent") {
					activity.createType = activityData.payload.ref_type;
					activity.description = activityData.payload.description;

					if (activity.createType === "branch") {
						activity.branch = activityData.payload.ref;
					}
				}

				activityList.push(activity);
			});

			displayActivityData();
		};

		var displayActivityData = function displayActivityData() {
			var activityElement = '';

			activityList.forEach(function (activity, index) {
				if (activity.type === "PushEvent") {
					activityElement += buildPushEvent(activity);
				} else if (activity.type === "CreateEvent") {

					if (activity.createType === "repository") {
						activityElement += buildCreateRepositoryEvent(activity);
					} else if (activity.createType === "branch") {
						activityElement += buildCreateBranchEvent(activity);
					}
				}
			});

			$('#activityListing').append(activityElement);
		};

		// Display the repository data (called within loop)
		var buildPushEvent = function buildPushEvent(activity) {
			var pushElement = '<div class="activity">\n\t\t\t\t\t<div class="activity-icon">\n\t\t\t\t\t\t<img src="images/octicons/svg/git-commit.svg">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="activity-body">\n\t\t\t\t\t\t<p class="time-since">' + moment(activity.date).fromNow() + '</p>\n\t\t\t\t\t\t<h4 class="activity-title">\n\t\t\t\t\t\t\t<a href="' + activity.actorUrl + '">' + activity.actorUsername + '</a> pushed to \n\t\t\t\t\t\t\t<a href="' + activity.commitUrl + '">' + activity.commitBranch + '</a> at \n\t\t\t\t\t\t\t<a href="' + activity.repositoryUrl + '">' + activity.repositoryName + '</a>\n\t\t\t\t\t\t</h4>\n\t\t\t\t\t\t<div class="activity-description">\n\t\t\t\t\t\t\t<img class="user-repo" src="' + activity.actorAvatar + '" alt="' + activity.actorUsername + '">\n\t\t\t\t\t\t\t<img class="last-user" src="' + activity.actorAvatar + '" alt="' + activity.actorUsername + '">\n\t\t\t\t\t\t\t<p><a href="' + activity.commitUrl + '">' + activity.commitSha + '</a> ' + activity.commitMessage + '</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t </div>';

			return pushElement;
		};

		// Display the repository data (called within loop)
		var buildCreateRepositoryEvent = function buildCreateRepositoryEvent(activity) {
			var createElement = '<div class="activity">\n\t\t\t\t\t<div class="activity-icon">\n\t\t\t\t\t\t<img src="images/octicons/svg/repo.svg">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="activity-body">\n\t\t\t\t\t\t<p class="time-since">' + moment(activity.date).fromNow() + '</p>\n\t\t\t\t\t\t<h4 class="activity-title">\n\t\t\t\t\t\t\t<a href="' + activity.actorUrl + '">' + activity.actorUsername + '</a> created new repository  \n\t\t\t\t\t\t\t<a href="' + activity.repositoryUrl + '">' + activity.repositoryName + '</a>\n\t\t\t\t\t\t</h4>\n\t\t\t\t\t\t<div class="activity-description">\n\t\t\t\t\t\t\t<img class="last-user" src="' + activity.actorAvatar + '" alt="' + activity.actorUsername + '">\n\t\t\t\t\t\t\t<p>' + activity.description + '</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t </div>';

			return createElement;
		};

		// Display the repository data (called within loop)
		var buildCreateBranchEvent = function buildCreateBranchEvent(activity) {
			var createElement = '<div class="activity">\n\t\t\t\t\t<div class="activity-icon">\n\t\t\t\t\t\t<img src="images/octicons/svg/git-branch.svg">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="activity-body">\n\t\t\t\t\t\t<p class="time-since">' + moment(activity.date).fromNow() + '</p>\n\t\t\t\t\t\t<h4 class="activity-title">\n\t\t\t\t\t\t\t<a href="' + activity.actorUrl + '">' + activity.actorUsername + '</a> created new branch \n\t\t\t\t\t\t\t<a href="' + activity.repositoryUrl + '">' + activity.branch + '</a> at  \n\t\t\t\t\t\t\t<a href="' + activity.repositoryUrl + '">' + activity.repositoryName + '</a>\n\t\t\t\t\t\t</h4>\n\t\t\t\t\t\t<div class="activity-description">\n\t\t\t\t\t\t\t<img class="last-user" src="' + activity.actorAvatar + '" alt="' + activity.actorUsername + '">\n\t\t\t\t\t\t\t<p>' + activity.description + '</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t </div>';

			return createElement;
		};

		return {
			buildActivityList: getActivities
		};
	}();

	Repositories.buildRepositoryList();
	Activity.buildActivityList();
});