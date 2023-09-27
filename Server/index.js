<head>
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-68J35F2R6N"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'G-68J35F2R6N');
	</script>

	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Playlist Heardle | ArjhanToteck</title>
	<link href="/style.css" rel="stylesheet" type="text/css" media="all">
	<link rel="icon" href="/favicon.png">

	<style>
		.audioContainer {
			width: 75%;
			background-color: gray;
			border-radius: 4px;
		}

		.audioProgress, .audioSegment {
			width: 0px;
			height: 20px;
			border-radius: 4px;
			text-align: center;
			line-height: 30px;
			font-weight: bold;
			transition: width 0.3s ease-in-out;
		}

		.audioProgress {
			position: absolute;
			background-color: white;
		}

		.audioSegment {
			background-color: #c2c2c2;
		}

		.audioProgressText {
			margin-top:5px;
			font-size: 12px;
		}

		.highlight {
			background-color: white;
			color: #262626;
			border-radius: 5px;
		}
	</style>
</head>

<h1 class="glitch" data-text="Playlist Heardle">Playlist Heardle</h1>

<br>
<br>
<div id="menu">
	Enter a playlist link and guess a random song from it.

	<br>
	<br>

	<input autocomplete="off" id="playlistLink" placeholder="Spotify playlist link" size="30">
	<br>
	<br>
	<button id="playButton" onclick="startGame()">Play</button>
	<br>
	<br>
	<div id="loading" style="display:none">Loading...</div>
	<br>
</div>

<div id="game" style="display:none">
	Try guessing the song from the first few seconds. Skip forward if you can't get it yet.

	<br>
	<br>
	<br>

	<div class="audioContainer" id="audioContainer">
		<audio autoplay="true" id="audio"></audio>
		<div class="audioSegment" id="audioSegment">
			<div class="audioProgress" id="audioProgress"></div>
		</div>
	</div>
	<div class="audioProgressText" id="audioProgressText">0:00/0:16</div>

	<br>

	<button style="height: 50px; width: 50px" onclick="play()" id="playButton">
		<svg style="width: 40px; transform: translate(-3px, 2px);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 100;" xml:space="preserve">
			<style type="text/css">
				.st0{fill-rule:evenodd;clip-rule:evenodd;fill:black;}
			</style>
			<path class="st0" d="M50,5.021c24.841,0,44.979,20.138,44.979,44.979S74.841,94.979,50,94.979C25.159,94.979,5.021,74.841,5.021,50  C5.021,25.159,25.159,5.021,50,5.021L50,5.021z M43.788,29.466c-2.222-1.906-5.711-0.338-5.711,2.627v35.814h0.013  c-0.003,2.729,3.156,4.455,5.461,2.797l24.857-17.868c1.918-1.351,2.021-4.219,0.055-5.634L43.788,29.466L43.788,29.466z M60.543,50  L44.996,38.825v22.35L60.543,50L60.543,50z M76.912,23.088c-14.863-14.863-38.961-14.863-53.824,0  c-14.862,14.862-14.863,38.961,0,53.824c14.863,14.863,38.962,14.863,53.824,0C91.775,62.049,91.775,37.951,76.912,23.088z"/>
		</svg>
	</button>

	<button style="height: 50px; width: 50px" onclick="skip()" id="skipButton">
		<svg style="width: 40px; transform: translate(-3px, 2px);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" style="enable-background:new 0 0 100 100;" xml:space="preserve">
			<style type="text/css">
				.st0{fill-rule:evenodd;clip-rule:evenodd;fill:black;}
			</style>
			<path class="st0" d="M50,5.021c24.841,0,44.979,20.138,44.979,44.979S74.841,94.979,50,94.979C25.159,94.979,5.021,74.841,5.021,50  C5.021,25.159,25.16,5.021,50,5.021L50,5.021z M57.018,33.616c-2.208-1.983-5.771-0.426-5.771,2.574v8.896L36.807,33.616  c-2.448-2.068-5.77-0.249-5.77,2.574v27.618h0.007c-0.001,2.805,3.313,4.522,5.602,2.703l14.603-11.599v8.896h0.007  c-0.001,2.805,3.313,4.522,5.602,2.703l17.336-13.77c1.749-1.365,1.826-4.033,0.049-5.445L57.018,33.616L57.018,33.616z M66.541,50  l-8.374-6.651v13.303L66.541,50L66.541,50z M46.33,50l-8.374-6.651v13.303L46.33,50L46.33,50z M76.912,23.088  c-14.863-14.863-38.961-14.863-53.824,0c-14.862,14.862-14.863,38.961,0,53.824c14.863,14.863,38.962,14.863,53.824,0  C91.775,62.049,91.775,37.951,76.912,23.088z"/>
		</svg>
	</button>
	<br>
	<br>
	<input autocomplete="off" id="songGuess" placeholder="Guess the song name/artist" size="45" oninput="searchSongs(this.value)">
	<button>Guess</button>
	<br>
	<div id="searchResults" style="display: none;">
		<ul id="resultsList"></ul>
	</div>

</div>

<script>
	const server = "https://playlist-heardle.arjhantoteck.repl.co";

	// segments to split song into
	const segments = [1, 2, 4, 7, 11, 16];

	// dom references
	const audioElement = document.getElementById("audio");
	const audioProgress = document.getElementById("audioProgress");
	const audioSegment = document.getElementById("audioSegment");
	const audioProgressText = document.getElementById("audioProgressText");
	const audioContainer = document.getElementById("audioContainer");
	const skipButton = document.getElementById("skipButton");
	const searchResults = document.getElementById("searchResults");
	const resultsList = document.getElementById("resultsList");


	// max time is 30 seconds, limit starts at 1
	const duration = segments[segments.length - 1];
	let currentLimitIndex = 0;

	let tracks;
	let answerIndex;

	function startGame() {
		let playlistLink = document.getElementById("playlistLink");
		let playButton = document.getElementById("playButton");
		playlistLink.disabled = true;
		playButton.disabled = true;

		// show loading indicator
		document.getElementById("loading").style.display = "block";

		// get playlist id from provided url
		let playlistId = playlistLink.value.split("playlist/")[1].split("?")[0];

		// make request for game data
		fetch(server + "/playlist?" + playlistId)
			.then(res => res.json())
			.then(data => {
			tracks = data.tracks.map(function(track){
				return track.name + " by " + track.artists;
			});

			answerIndex = data.answerIndex;

			// get audioUrl
			let audioUrl = server + "/callback?" + encodeURIComponent(data.callback);

			// set audioUrl to audioElement for play
			audioElement.src = audioUrl;

			// wait for audio to load
			audioElement.addEventListener('loadedmetadata', function() {
				document.getElementById("game").style.display = "block";
				document.getElementById("menu").style.display = "none";

				// play audio when loaded
				audioElement.play();


				setAudioSegment();


				audioElement.addEventListener('timeupdate', function() {
					// calculate progress
					let currentTime = audioElement.currentTime;

					if (currentTime >= segments[currentLimitIndex]) {
						audioElement.pause();
						currentTime = segments[currentLimitIndex];
					}

					let percentage = (currentTime / duration) * 100;

					// calculate width relative to audioContainer
					let progressWidth = (percentage / 100) * audioContainer.offsetWidth;

					// set progress indicator
					audioProgress.style.width = progressWidth + "px";
					audioProgressText.innerText = formatTimeString(currentTime) + "/" + formatTimeString(duration);
				});
			});
		});
	}

	function play(){
		audioElement.currentTime = 0;
		audioElement.play();
	}

	function skip(){
		currentLimitIndex++;
		setAudioSegment();
		audioElement.currentTime = 0;
		audioElement.play();

		if(currentLimitIndex == segments.length - 1){
			skipButton.disabled = true;
		}
	}

	function setAudioSegment(){
		let percentage = (segments[currentLimitIndex] / duration) * 100;
		audioSegment.style.width = percentage + "%";
	}

	function formatTimeString(time){
		// format time string
		const date = new Date(0);
		date.setSeconds(time);
		return date.toISOString().substring(14, 19);
	}

	function searchSongs(query) {
		const keywords = query.toLowerCase().split(' ');

		const results = filterSongs(keywords);

		// clears previous results
		resultsList.innerHTML = "";

		// display results
		if (results.length > 0) {
			results.forEach((result) => {
				const listItem = document.createElement("li");
				const highlightedResult = highlightMatchingKeywords(result, keywords);
				listItem.innerHTML = highlightedResult;
				resultsList.appendChild(listItem);
			});

			// display dropdown
			searchResults.style.display = "block";
		} else {
			// hide dropdown
			searchResults.style.display = "none";
		}
	}

	function filterSongs(keywords) {
		return tracks.filter((song) => {
			const lowercaseSong = song.toLowerCase();
			return keywords.some((keyword) => lowercaseSong.includes(keyword));
		});
	}

	function highlightMatchingKeywords(text, keywords) {
		const lowercasedText = text.toLowerCase();
		for (const keyword of keywords) {
			const regExp = new RegExp(keyword, 'gi'); // 'gi' for global and case-insensitive match
			text = text.replace(regExp, (match) => `<span class="highlight">${match}</span>`);
		}
		return text;
	}

</script>