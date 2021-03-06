	// Get value from input, inject to query string in call to API.
	var searchReq = function() {
		removeResults();
		var search = $('#search-box').val();
		if (!$('.search').hasClass('searching')) {
			$('.search').addClass('searching');
			$('.search').animate({ 'marginTop': "-=2em"});
		}
		ajaxCall(search);
	};

	// Remove search results from page.
	 function removeResults() {
			if ($('.search').hasClass('searching')) {
				$('section').remove();
				$('.search').animate({'marginTop': "+=2em"});
				$('.search').removeClass('searching');
			 }
	};

	// Call searchReq on click
	$('#search-button').on('click', searchReq);

	// If enter key is pressed, run search.
	// Else if escape is pressed, remove results.
	$(document).keyup(function(e) {
    if (e.which === 13) {
    	searchReq();
    } else if (e.keyCode === 27) {
				removeResults();
		 }
});

	// Check if the input was cleared
	$('#search-box').on("mouseup", function(){
  var $input = $(this);
  var oldValue = $input.val();

  if (oldValue === '' && !$('.search').hasClass('searching')) {
		return;
	}

	// Event is fired before search is cleared. Wait a second.
  setTimeout(function(){
    var newValue = $input.val();

    if (newValue === ''){
      removeResults();
    }
  }, 1);
});

	// call to API
  function ajaxCall(searchString) {
    $.ajax({
      dataType: 'json',
      url: 'https://en.wikipedia.org/w/api.php?	action=opensearch&format=json&search=' + searchString + '&namespace=0%7C4&limit=10&callback=?',
			success: function(response) {
				var searchMatches = [];
				var results = document.createElement('section');

				// New objects with API result data
				var i = 0;

				while (i < response[1].length) {
					var searchResult = {};
					for (var j = 1; j < 4; j++) {
						if (j === 1) {
							searchResult.item = response[j][i];
						} else if (j === 2) {
								searchResult.description = response[j][i];
						} else if (j === 3) {
								searchResult.link = response[j][i];
						}
					}
					searchMatches.push(searchResult);
					i++;
				}

				// Append new object to section.
				searchMatches.forEach(function(result) {
					$(results).append('<a target="_blank" href="' + result.link + '"><p class="result-item">' + result.item + '</p><p class="result-description">' + result.description + '</p></a>')
				});

			// Render to page
			$(results).appendTo('div.container');

			} // end success function
    }); // end $.ajax
  } // end ajaxCall()
