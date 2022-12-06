import { getAccessTokenFromSecureStorage } from "musicmap/util/TokenRequests";

/*
* https://developer.spotify.com/documentation/web-api/reference/#/operations/get-track 
* Returns: {
    spotify albumID (string), 
    album name, 
    album release date (string), 
    popularity of track, 
    song preview url (can be null)
}
*/
export const getTrack = async (trackID) => {
  try {
    let accessToken = await getAccessTokenFromSecureStorage();
    const response = await fetch(
      `https://api.spotify.com/v1/tracks/${trackID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response) {
      const responseJson = await response.json();
      return {
        albumID: responseJson.album.id,
        albumName: responseJson.album.name,
        releaseDate: responseJson.album.releaseDate,
        trackPopularity: responseJson.popularity,
        previewURL: responseJson.preview_url,
      };
    }
  } catch {
    console.log("COULD NOT GET TRACK :(");
  }
};

/*
* https://developer.spotify.com/documentation/web-api/reference/#/operations/get-the-users-currently-playing-track
* Returns: {
    spotify trackID, 
    name of track, 
    track artist name, 
    album cover, 
}   
*/
export const getCurrentlyPlayingTrack = async () => {
  try {
    let accessToken = await getAccessTokenFromSecureStorage();
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response) {
      const responseJson = await response.json();
      return {
        trackID: responseJson.item.id,
        title: responseJson.item.name,
        artist: responseJson.item.artists[0].name,
        imageURL: responseJson.item.album.images[0].url,
      };
    }
  } catch {
    console.log("COULD NOT GET CURRENTLY PLAYING TRACK :(");
  }
};

/*
* https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features
* Returns: {
    acousticness, (number - float)
    danceability, (number - float)
    duration, (integer, in milliseconds)
    energy, (number - float)
    instrumentalness, (number - float)
    key, (integer, >= -1, <= 11)
    liveness, (number - float)
    loudness, (number - float)
    modality, (integer)
    speechiness, (number - float)
    tempo, (number - float)
    time_signature, (integer)
    valence, (number - float)
}
*/
export const getTracksAudioFeatures = async (trackID) => {
  try {
    let accessToken = await getAccessTokenFromSecureStorage();
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${trackID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
     
    if (response) {
      const responseJson = await response.json();
      return {
        acousticness: responseJson.acousticness,
        danceability: responseJson.danceability,
        duration_ms: responseJson.duration_ms,
        energy: responseJson.energy,
        instrumentalness: responseJson.instrumentalness,
        key: responseJson.key,
        liveness: responseJson.liveness,
        loudness: responseJson.loudness,
        mode: responseJson.mode,
        speechiness: responseJson.speechiness,
        tempo: responseJson.tempo,
        timeSignature: responseJson.time_signature,
        valence: responseJson.valence,
      };
    }
  } catch {
    console.log("COULD NOT GET SONG'S AUDIO FEATURES :(");
  }
};