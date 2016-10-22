$(document).ready(function() {

	var Repositories = (function() {

		var repositoryList = [];
		var Repository = function() {};

		var getRepositories = function() {
			$.ajax({
				url: 'https://api.github.com/users/tomgobich/repos',
				success: function(resp) {
					setupRepositoryData(resp);
				}
			});
		}

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

			getRepositoryBranchCount();

		}

		var getRepositoryBranchCount = function() {
			repositoryList.forEach(function(repo, index) {
				(function(index) {
					$.ajax({
						url: `https://api.github.com/repos/tomgobich/${repositoryList[index].name}/branches`,
						success: function(resp) {
							repositoryList[index].branchCount = resp.length;
							displayRepositoryData(index);
						}
					});
				})(index);
			});
		}

		// HTML block removed from Repo listing
		// <div class="repository-fork">
		// 	<img src="images/octicons/svg/repo-forked.svg">
		// 	<p>forked from <a href="#">theironyard/js-assginments</a></p>
		// </div>

		var displayRepositoryData = function(index) {
			let repositoryElement =
				`<div class="repository">
					<div class="repository-left">
						<h3 class="repository-name"><a href="#">${repositoryList[index].name}</a></h3>
						<p class="repository-about">${repositoryList[index].description}</p>
						<p class="repository-update">${repositoryList[index].updated}</p>
					</div>
					<div class="repository-right">
						<h4 class="repository-type">${repositoryList[index].language}</h4>
						<img src="images/octicons/svg/star.svg">
						<h4 class="repository-stars">${repositoryList[index].starCount}</h4>
						<img src="images/octicons/svg/git-branch.svg">
						<h4 class="repository-branches">${repositoryList[index].branchCount}</h4>
					</div>
				 </div>`;

			$('#repositoryListing').append(repositoryElement);
		}

		return {
			buildRepositoryList: getRepositories
		}

	})();

	Repositories.buildRepositoryList();

});