import { v4 } from "uuid";

let tracks = [];

export const trackMemStore = {
  async getAllTracks() {
    return tracks;
  },

  async addTrack(playlistId, track) {
    track._id = v4();
    track.playlistId = playlistId;
    tracks.push(track);
    return track;
  },

  async getTracksByPlaylistId(id) {
    return tracks.filter((track) => track.playlistId === id);
  },

  async getTrackById(id) {
    return tracks.find((track) => track._id === id);
  },

  async getPlaylistTracks(playlistId) {
    return tracks.filter((track) => track.playlistId === playlistId);
  },

  async deleteTrackById(id) {
    const index = tracks.findIndex((track) => track._id === id);
    tracks.splice(index, 1);
  },

  async deleteAllTracks() {
    tracks = [];
  },

  async updateTrack(track, updatedTrack) {
    track.title = updatedTrack.title;
    track.artist = updatedTrack.artist;
    track.duration = updatedTrack.duration;
  },
};