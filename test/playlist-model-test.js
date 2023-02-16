import { assert } from "chai";
import { db } from "../src/models/db.js";
import { abba, testPlaylists } from "./fixtures.js";

suite("Playlist API tests", () => {

  setup(async () => {
    db.init();
    await db.playlistStore.deleteAllPlaylists();
    for (let i = 0; i < testPlaylists.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await db.playlistStore.addPlaylist(testPlaylists[i]);
    }
  });

  test("create a playlist", async () => {
    const newPlaylist = await db.playlistStore.addPlaylist(abba);
    assert.deepEqual(abba, newPlaylist);
    assert.isDefined(newPlaylist._id);
  });

  test("delete all playlists", async () => {
    let returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 3);
    await db.playlistStore.deleteAllPlaylists();
    returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, 0);
  });

  test("get a playlist", async () => {
    const playlist = await db.playlistStore.addPlaylist(abba);
    const returnedPlaylist = await db.playlistStore.getPlaylistById(playlist._id);
    assert.equal(playlist, returnedPlaylist);
  });

  test("get a playlist - fail", async () => {
    assert.isNull(await db.playlistStore.getPlaylistById("bad-id"));
  });

  test("get a playlist - bad params", async () => {
    assert.isNull(await db.playlistStore.getPlaylistById(""));
    assert.isNull(await db.playlistStore.getPlaylistById());
  });

  test("delete a playlist", async () => {
    await db.playlistStore.deletePlaylistById(testPlaylists[0]._id);
    const returnedPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(returnedPlaylists.length, testPlaylists.length - 1);
    const deletedPlaylist = await db.playlistStore.getPlaylistById(testPlaylists[0]._id);
    assert.isNull(deletedPlaylist);
  });

  test("delete a playlist - fail", async () => {
    await db.playlistStore.deletePlaylistById("bad-id");
    const allPlaylists = await db.playlistStore.getAllPlaylists();
    assert.equal(testPlaylists.length, allPlaylists.length);
  });

});