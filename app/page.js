"use client";

import FilterSelect from "@/src/components/FilterSelect";
import LoadingBar from "@/src/components/LoadingBar";
import { useRef, useState } from "react";

// segments to split the song into
const segments = [1, 2, 4, 8, 12];

export default function Page() {
	const [page, setPage] = useState("home");
	const [playlistLink, setPlaylistLink] = useState("");
	const [audioPercentage, setAudioPercentage] = useState(0);
	const [progressLabel, setProgressLabel] = useState("");
	const [songAudio, setSongAudio] = useState("");

	const songData = useRef(null);
	const audio = useRef(null);
	const guess = useRef(null);

	const segmentIndex = useRef(0);
	const trackList = useRef(null);

	return (
		<main>

			<h1>Playlist Heardle</h1>

			{
				// home page
				page == "home" &&
				<section>
					<p>Enter a Spotify playlist link (make sure it's an open.spotify.com link) and see how well you know the songs. You'll have to guess a random song from a short preview.</p>

					<br />

					<input placeholder="Playlist link" value={playlistLink} onChange={(data) => setPlaylistLink(data.target.value)} />

					<br />

					<button onClick={startGame}>Play</button>

					<br />

				</section>
			}

			{
				// game page
				page == "game" &&
				<section>

					<p>Try guessing the song from the first {getSecondsDescription()} of the preview. Skip forward if you can't get it yet.</p>

					<br />
					<br />

					<audio ref={audio} src={songAudio} onTimeUpdate={timeUpdate} autoPlay />

					<LoadingBar percentage={audioPercentage} label={progressLabel} />

					<br />

					<div style={{ display: "flex", gap: "10px" }}>
						<button onClick={play}>Play</button>
						<button onClick={skip}>Skip</button>
					</div>

					<br />
					<br />


					<div style={{ display: "flex", gap: "10px" }}>
						<FilterSelect
							placeholder="Guess a song/artist"
							options={trackList.current}
							style={{ width: "17em" }}
							onChange={(event) => guess.current = event.target.value}
							onSelect={(option) => guess.current = option}
						/>
						<button onClick={sendGuess}>Guess</button>
					</div>

				</section>
			}

			{
				// win page
				page == "win" &&
				<section>

					<p>You won! You guessed the song correctly after hearing {getSecondsDescription()}.</p>

					<p>The song was {songData.current.title} by {songData.current.subtitle}.</p>

					<br />

					<SpotifyEmbed songId={songData.current?.uri.split("track:")[1]} />

					<br />
					<br />

					<button onClick={() => { location.reload() }}>Play Again</button>

				</section>
			}

			{
				// lose page
				page == "lose" &&
				<section>

					<p>You lost. The song was {songData.current.title} by {songData.current.subtitle}.</p>

					<br />

					<SpotifyEmbed songId={songData.current?.uri.split("track:")[1]} />

					<br />
					<br />

					<button onClick={() => { location.reload() }}>Play Again</button>

				</section>
			}
		</main >
	);

	function SpotifyEmbed({ songId }) {
		return (
			<iframe src={"https://open.spotify.com/embed/track/" + songId} allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" height="352" style={{ border: 0 }}></iframe>
		)
	}

	function getSecondsDescription() {
		const audioLimit = segments[segmentIndex.current];

		// plural ending for second/seconds
		const pluralEnding = segments[segmentIndex.current] == 1 ? "" : "s";

		return audioLimit + " second" + pluralEnding;
	}

	async function startGame() {
		// change page
		setPage("game");

		// get id from playlist link
		const playlistId = playlistLink.split("/playlist/")[1].split("/")[0];

		// get playlist data
		const response = await fetch(process.env.NEXT_PUBLIC_PROCESSING_SERVER + "/api/projects/playlistHeardle?playlist=" + playlistId);
		const data = await response.json();

		// store random song data
		songData.current = data.randomSong;
		setSongAudio(data.randomSong.audioPreview.url);

		// store track list
		trackList.current = data.trackList;
	}

	function play() {
		audio.current.currentTime = 0;
		audio.current.play();
	}

	function skip() {
		if (segmentIndex.current < segments.length - 1) {
			// move to next segment
			segmentIndex.current++;

			play();
		} else {
			setPage("lose");
		}
	}

	function sendGuess() {
		// TODO: have this done in the back end
		// the issue is it breaks the unicode encoding for some reason
		const realSong = songData.current.title + " by " + songData.current.subtitle;

		// TODO: actual end game
		if (guess.current == realSong) {
			setPage("win");
		} else {
			skip();
		}
	}

	function timeUpdate() {
		setProgressLabel(
			formatSeconds(audio.current.currentTime)
			+ "/" +
			formatSeconds(segments[segments.length - 1])
		);

		// update loading bar percentage
		const percentage = audio.current.currentTime / segments[segments.length - 1];
		setAudioPercentage(percentage);

		const audioLimit = segments[segmentIndex.current];

		// check if audio limit passed or met
		if (audio.current.currentTime >= audioLimit) {
			// pause and limit
			audio.current.pause();
			audio.current.currentTime = audioLimit;
		}
	}

	function formatSeconds(seconds) {
		if (isNaN(seconds) || seconds < 0) {
			return "00:00";
		}

		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		const pad = (n) => String(n).padStart(2, "0");

		return hrs > 0
			? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
			: `${pad(mins)}:${pad(secs)}`;
	}

}