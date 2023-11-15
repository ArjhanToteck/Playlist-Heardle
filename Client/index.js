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
const songGuess = document.getElementById("songGuess");
const guessButton = document.getElementById("guessButton");
const searchResults = document.getElementById("searchResults");
const resultsList = document.getElementById("resultsList");
const message = document.getElementById("message");
const gameOver = document.getElementById("gameOver");
const gameOverMessage = document.getElementById("gameOverMessage");
const spotifyEmbed = document.getElementById("spotifyEmbed");

// max time is 30 seconds, limit starts at 1
const duration = segments[segments.length - 1];
let numberOfSkips = 0;

let tracks;
let answerIndex;
let answerId;

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

			tracks = data.tracks.map(function(track) {
				return track.name + " by " + track.artists;
			});

			answerIndex = data.answerIndex;

			answerId = data.tracks[answerIndex].url.split("/");
			answerId = answerId[answerId.length - 1];

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

				audioElement.ontimeupdate = function() {
					// calculate progress
					let currentTime = audioElement.currentTime;

					if (currentTime >= segments[numberOfSkips]) {
						audioElement.pause();
						currentTime = segments[numberOfSkips];
					}

					let percentage = (currentTime / duration) * 100;

					// calculate width relative to audioContainer
					let progressWidth = (percentage / 100) * audioContainer.offsetWidth;

					// set progress indicator
					audioProgress.style.width = progressWidth + "px";
					audioProgressText.innerText = formatTimeString(currentTime) + "/" + formatTimeString(duration);
				}
			});
		});
}

function play() {
	audioElement.currentTime = 0;
	audioElement.play();
}

function skip() {
	numberOfSkips++;
	setAudioSegment();
	audioElement.currentTime = 0;
	audioElement.play();

	if (numberOfSkips == segments.length - 1) {
		skipButton.disabled = true;
	}
}

function setAudioSegment() {
	let percentage = (segments[numberOfSkips] / duration) * 100;
	audioSegment.style.width = percentage + "%";
}

function formatTimeString(time) {
	// format time string
	const date = new Date(0);
	date.setSeconds(time);
	return date.toISOString().substring(14, 19);
}

function searchSongs() {
	let query = songGuess.value;

	guessButton.disabled = true

	// check if search matches an actual song
	for (let i = 0; i < tracks.length; i++) {
		if (tracks[i] == query) {
			// enable guess button
			guessButton.disabled = false;
			break;
		}
	}

	// lowercase query and split into keywords from longest to shortest
	const keywords = query.toLowerCase().split(' ').filter(word => word).sort((a, b) => b.length - a.length);

	// filters search
	const results = filterSongs(keywords);

	// clears results
	resultsList.innerHTML = "";

	// displays results
	if (results.length > 0) {
		results.forEach((result) => {
			const listItem = document.createElement("li");
			listItem.innerHTML = `<a>${result.highlightedText}</a>`;
			resultsList.appendChild(listItem);

			listItem.onclick = function() {
				songGuess.value = result.name;
				searchSongs();
			}
		});

		// display dropdown
		searchResults.style.display = "block";
	} else {
		// hide dropdown
		searchResults.style.display = "none";
	}
}

function filterSongs(keywords) {
	const results = [];

	tracks.forEach((track) => {
		const trackLower = track.toLowerCase();

		// checks if all keywords match
		if (keywords.every(keyword => trackLower.includes(keyword))) {
			results.push({
				name: track,
				highlightedText: highlightKeywords(track, keywords)
			});
		}
	});

	return results;
}

function highlightKeywords(text, keywords) {
	// make sure only words outside of html tags are highlighted
	const keywordRegex = new RegExp(`([^>]*>)?(${keywords.map((string) => {return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}).join('|')})(?![^<]*<)`, 'gi');

	return text.replace(keywordRegex, (match, htmlTag, keyword) => {
		if (htmlTag) {
			// return match without highlighting if it's a tag or if it's already highlighted
			return `${htmlTag}${keyword}`;
		} else {
			// highlight the word if it matches the regex
			return `<span class="highlight">${match}</span>`;
		}
	});
}

function submitGuess() {
	if (songGuess.value == tracks[answerIndex]) {
		endGame("You guessed the song correctly!");
	} else {
		// check if still has guesses left
		if (numberOfSkips < segments.length - 1) {
			message.innerText = "Not quite. Try again.";
			skip();
		} else {
			endGame("You didn't get this one. Better luck next time.");
		}
	}
}

function endGame(message) {
	game.style.display = "none";
	gameOver.style.display = "block";
	gameOverMessage.innerText = message;
	spotifyEmbed.src = "https://open.spotify.com/embed/track/" + answerId;

	// start playing song
	audioElement.ontimeupdate = undefined;
	audioElement.currentTime = 0;
	audioElement.play();
}