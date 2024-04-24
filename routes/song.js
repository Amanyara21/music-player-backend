const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const Artist = require('../models/Artist');

// Get all songs
router.get('/songs', async (req, res) => {
    try {
        console.log("okk")
        const songs = await Song.find().populate('artist');
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err.message);
    }
});

// Get song using artistName
router.get('/songs/:artistName', async (req, res) => {
    try {
        const artistName = req.params.artistName;
        const artist = await Artist.findOne({ name: artistName });
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        const songs = await Song.find({ artist: artist._id }).populate('artist');
        res.json(songs);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err.message);
    }
});

// Add a new song
router.post('/songs', async (req, res) => {
    try {
        const { name, url, artistName } = req.body;
        const artist = await Artist.findOne({ name: artistName });
        if (!artist) {
            return res.status(400).json({ message: 'Artist not found' });
        }

        const newSong = new Song({ name, url, artist });
        await newSong.save();
        res.status(201).json(newSong);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Get all artists
router.get('/artists', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err.message);
    }
});

router.post('/artists', async (req, res) => {
    try {
      const { name, image } = req.body;
      if (!name || !image) {
        return res.status(400).json({ message: 'Please provide name and image for the artist' });
      }
  
      const existingArtist = await Artist.findOne({ name });
      if (existingArtist) {
        return res.status(400).json({ message: 'Artist already exists' });
      }
  
      const newArtist = new Artist({ name, image });
      await newArtist.save();
      res.status(201).json(newArtist);
    } catch (err) {
      res.status(400).json({ message: err.message });
      console.log(err.message);
    }
  });
  

module.exports = router;
