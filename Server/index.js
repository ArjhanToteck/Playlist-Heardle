const http = require("http");
const fetch = require("node-fetch");

const ytSearch = require("youtube-search-without-api-key");
const ytdl = require("ytdl-core");

// opens http server
let server = http.createServer(function(req, res) {
	const defaultHeaders = {
		"Access-Control-Allow-Origin": "null.jsbin.com",
		"Content-Type": "text/plain"
	};

	try {
		// checks if trying to download playlist
		if (req.url.substring(0, 10) == "/playlist?") {
			// starts to download playlist
			getPlaylistData(decodeURIComponent(req.url.split("/playlist?")[1]));

		} else {
			throw (new Error());
		}		

		// gets song data from spotify playlist
		function getPlaylistData(id) {
			// stores songs
			let tracks;

			// fetches playlist to get access token
			fetch(`https://open.spotify.com/playlist/${id}`)
				.then((response) => response.text())
				.then((tokenData) => {
					// loads token from result
					let token = tokenData.split(`"accessToken":"`)[1].split(`",`)[0];

					// fetches first 100 songs
					fetch(`https://api.spotify.com/v1/playlists/${id}`, {
							"headers": {
								"authorization": "Bearer " + token
							},
						})
						.then((response) => response.json())
						.then((data) => {
							console.log(`\n\nStarted downloading playlist ${data.name} (https://open.spotify.com/playlist/${id}) at ${new Date().toLocaleString()}`)

							// loads first 100 songs into tracks object
							tracks = data.tracks.items;

							// checks if there are more songs to download
							if (!!data.tracks.next) {

								// recursive function to fetch the next songs
								fetchNext(data.tracks.next);

								function fetchNext(next) {
									// loads next 100 songs
									fetch(next, {
											"headers": {
												"authorization": "Bearer " + token
											},
										})
										.then((response) => response.json())
										.then((newData) => {
											// adds next 100 songs to array
											tracks = tracks.concat(newData.items);

											// checks if there are more songs to download
											if (!!newData.next) {
												fetchNext(newData.next);
											} else {
												// if there are no more songs, starts choosing a song
												data.tracks.items = tracks;
												getSong(data);
											}
										});
								}
							} else {
								// if there are no more songs, starts choosing a song
								getSong(data);
							}
						});
				});
		}

		function getSong(data){
			console.log(data);
		}

	} catch (e) {
		res.writeHead(200, defaultHeaders);
		res.end("Placeholder, lmao");
	}
});

server.setTimeout(0);
server.listen(8443);
console.log("Server running on port 8443");