'use strict';

$(document).ready(function () {

	var Repositories = function () {

		var repositoryList = [];
		var Repository = function Repository() {};

		var getRepositories = function getRepositories() {
			$.ajax({
				url: 'https://api.github.com/users/tomgobich/repos',
				success: function success(resp) {
					setupRepositoryData(resp);
				}
			});
		};

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

			getRepositoryBranchCount();
		};

		var getRepositoryBranchCount = function getRepositoryBranchCount() {
			repositoryList.forEach(function (repo, index) {
				(function (index) {
					$.ajax({
						url: 'https://api.github.com/repos/tomgobich/' + repositoryList[index].name + '/branches',
						success: function success(resp) {
							repositoryList[index].branchCount = resp.length;
							displayRepositoryData(index);
						}
					});
				})(index);
			});
		};

		// HTML block removed from Repo listing
		// <div class="repository-fork">
		// 	<img src="images/octicons/svg/repo-forked.svg">
		// 	<p>forked from <a href="#">theironyard/js-assginments</a></p>
		// </div>

		var displayRepositoryData = function displayRepositoryData(index) {
			var repositoryElement = '<div class="repository">\n\t\t\t\t\t<div class="repository-left">\n\t\t\t\t\t\t<h3 class="repository-name"><a href="#">' + repositoryList[index].name + '</a></h3>\n\t\t\t\t\t\t<p class="repository-about">' + repositoryList[index].description + '</p>\n\t\t\t\t\t\t<p class="repository-update">' + repositoryList[index].updated + '</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="repository-right">\n\t\t\t\t\t\t<h4 class="repository-type">' + repositoryList[index].language + '</h4>\n\t\t\t\t\t\t<img src="images/octicons/svg/star.svg">\n\t\t\t\t\t\t<h4 class="repository-stars">' + repositoryList[index].starCount + '</h4>\n\t\t\t\t\t\t<img src="images/octicons/svg/git-branch.svg">\n\t\t\t\t\t\t<h4 class="repository-branches">' + repositoryList[index].branchCount + '</h4>\n\t\t\t\t\t</div>\n\t\t\t\t </div>';

			$('#repositoryListing').append(repositoryElement);
		};

		return {
			buildRepositoryList: getRepositories
		};
	}();

	Repositories.buildRepositoryList();
});