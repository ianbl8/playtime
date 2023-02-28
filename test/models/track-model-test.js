import { EventEmitter } from "events";
import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { abba, abbaTrack, eighties, testTracks } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Track model tests", () => {

  let eightiesList = null;

  setup(async () => {
    db.init("mongo");
    await db.playlistStore.deleteAllPlaylists();
    await db.trackStore.deleteAllTracks();
    eightiesList = await db.playlistStore.addPlaylist(eighties);
    for (let i = 0; i < testTracks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testTracks[i] = await db.trackStore.addTrack(eightiesList._id, testTracks[i]);
    }
  });

  test("create a track", async () => {
    const abbaList = await db.playlistStore.addPlaylist(abba);
    const track = await db.trackStore.addTrack(abbaList._id, abbaTrack);
    const newTrack = await db.trackStore.getTrackById(track._id);
    assertSubset(abbaTrack, newTrack);
  });

  test("delete all tracks", async () => {
    let returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length);
    await db.trackStore.deleteAllTracks();
    returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, 0);
  });

  test("get a track", async () => {
    const abbaList = await db.playlistStore.addPlaylist(abba);
    const track = await db.trackStore.addTrack(abbaList._id, abbaTrack)
    const returnedTrack = await db.trackStore.getTrackById(track._id);
    assertSubset(track, returnedTrack);
  });

  test("get a track - bad params", async () => {
    assert.isNull(await db.trackStore.getTrackById(""));
    assert.isNull(await db.trackStore.getTrackById());
  });

  test("delete a track", async () => {
    await db.trackStore.deleteTrackById(testTracks[0]._id);
    const returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, testTracks.length - 1);
    const deletedTrack = await db.trackStore.getTrackById(testTracks[0]._id);
    assert.isNull(deletedTrack);
  });

  test("delete a track - fail", async () => {
    await db.trackStore.deleteTrackById("bad-id");
    const allTracks = await db.trackStore.getAllTracks();
    assert.equal(testTracks.length, allTracks.length);
  });

});