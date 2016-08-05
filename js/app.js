$(function() {
	$('.input-title').submit(function(event) {
		event.preventDefault();
		$('.poster-display').html('');
		$('.info-data').html('');
		var movie = $(this).find("input[name='title']").val();
		$('.input-text').val('');
		getRequest(movie);
	});

	function getRequest(movie) {
		var posterOverview;
		var postersResults;
		var yearResults;

		var parameters = {
			query: movie,
			api_key: '0e28b74bfbe2d332c764d7c65bc06fa3' 
			}
		//first ajax request to get poster info and movie id #
		var requestResults = $.ajax({
			url: 'https://api.themoviedb.org/3/search/movie?',
			data: parameters,
			dataType: 'jsonp',
			type: 'GET',
			})
		.done(function(requestResults) {
			console.log(requestResults);
			posterOverview = requestResults.results[0].overview;
			postersResults = requestResults.results[0].poster_path;
			yearResults = requestResults.results[0].release_date;
			console.log(postersResults);
			console.log(yearResults);
			$('.info-data').show();
			$('.poster-display').append('<img class=poster-img src=https://image.tmdb.org/t/p/original' + postersResults + ' alt=image />');
			$('.info-data').append('<p id="overview">Overview: ' + posterOverview + '</p>');
			$('.info-data').append('<p id="year">Release Date: ' + yearResults + '</p>');
			var movieId = requestResults.results[0].id;
			//second ajax request to get credit info, that only comes with movie id# search
			var nextResults = $.ajax({
				url: 'https://api.themoviedb.org/3/movie/' + movieId + '?&api_key=0e28b74bfbe2d332c764d7c65bc06fa3&append_to_response=credits',
				dataType: 'jsonp',
				type: 'GET',
				})
			.done(function(nextResults) {
				console.log(nextResults)
				//crew info shifts in data so paring crew names with crew job
				firstCrewTitle = nextResults.credits.crew[1].job;
				secondCrewTitle = nextResults.credits.crew[2].job;
				firstCrewResult = nextResults.credits.crew[1].name;
				secondCrewResult = nextResults.credits.crew[2].name;
				starringResults = nextResults.credits.cast[1].name;
				//console.log(firstCrewResult);
				//console.log(secondCrewResult);
				//console.log(starringResults);
				$('.info-data').append('<p id="first-crew">' + firstCrewTitle + ': ' + firstCrewResult + '</p>');
				$('.info-data').append('<p id="second-crew">' + secondCrewTitle + ': ' + secondCrewResult + '</p>');
				$('.info-data').append('<p id="starring">Starring: ' + starringResults + '</p>');
			})
			.fail(function() {
				$('.poster-display').append('<p>Got nothing</p>');
			})
		})
		.fail(function() {
			$('.poster-display').append('<p>Error: We found nothing.</p>');
		})	
	};
});