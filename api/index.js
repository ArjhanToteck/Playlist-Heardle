export default async function transliterateToEgyptian(req, res) {
	try {
		// CORS allow all to make this a public API
		res.setHeader("Access-Control-Allow-Origin", "*");

		const { searchParams } = new URL(process.env.NEXT_PUBLIC_PROCESSING_SERVER + req.url);

		// get english from url search param
		const playlistId = decodeURIComponent(searchParams.get("playlist"));

		// get playlist embed page
		const response = await fetch("https://open.spotify.com/embed/playlist/" + playlistId);
		const embedPage = await response.text();

		// extract and parse playlist data json
		const playlistJson = JSON.parse(embedPage.split("type=\"application/json\">")[1].split("</script>")[0]);

		// get random song from tracks
		const trackList = playlistJson.props.pageProps.state.data.entity.trackList;
		const randomSong = trackList[Math.floor(Math.random() * trackList.length)];

		// send output
		res.setHeader("Content-Type", "application/json;");
		res.status(200).send(randomSong);
	} catch (error) {
		console.log(error);
		// send output
		res.setHeader("Content-Type", "text/plain;");
		res.status(500).send(error.message);
	}

}