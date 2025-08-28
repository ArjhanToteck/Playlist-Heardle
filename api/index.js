export default async function handler(req, res) {
	try {
		const { searchParams } = new URL(process.env.NEXT_PUBLIC_PROCESSING_SERVER + req.url);

		// get english from url search param
		const playlistId = decodeURIComponent(searchParams.get("playlist"));

		// get playlist embed page
		const response = await fetch("https://open.spotify.com/embed/playlist/" + playlistId);
		const embedPage = await response.text();

		// extract and parse page data json
		const pageJson = JSON.parse(embedPage.split("type=\"application/json\">")[1].split("</script>")[0]);
		const rawTracks = pageJson.props.pageProps.state.data.entity.trackList;

		// get random song from tracks
		const randomSong = rawTracks[Math.floor(Math.random() * rawTracks.length)];

		// format track list
		const trackList = rawTracks.map(getTrackName);

		// send output
		res.setHeader("Content-Type", "application/json;");
		res.status(200).send({ randomSong, trackList });
	} catch (error) {
		console.log(error);
		// send output
		res.setHeader("Content-Type", "text/plain;");
		res.status(500).json(error.message);
	}

}

function getTrackName(track) {
	return track.title + " by " + track.subtitle;
}