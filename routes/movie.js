var express = require('express');
var router = express.Router();

const movieDetails = require('../data/movieDetails');

function requireJSON(req, res, next) {
    if (req.is('application/json')) {
        res.json({ msg: 'content type must be app/json' });
    } else {
        next();
    }
}

router.param(('movieId'), (req, res, next) => {
    console.log('Someone hit a route that used the movieId wildcard');
    next();
});

/* GET movie page. */

// GET /movie/top_rated
router.get('/top_rated', (req, res, next) => {
    let page = req.query.page;
    if (!page) {page = 1;}
    const results = movieDetails.sort((a, b) => {
        return b.vote_average - a.vote_average;
    });
    const indexToStart = (page - 1) * 20;
    res.json(results.slice(indexToStart, indexToStart + 20));
});

// GET /movie/movieId
router.get('/:movieId', (req, res, next) => {
    const movieId = req.params.movieId;
    const results = movieDetails.find((movie) => {
        return movie.id == movieId;
    });
    if (!results) {
        res.json({ msg: 'Movie ID not found'});
    } else {
        res.json(results);
    }
});

// POST /movie/{movie_Id}/rating
router.post('/:movieId/rating', requireJSON, (req, res, next) => {
    const movieId = req.param.movieId;

    const userRating = req.body.value;
    if ((userRating < .5) || (userRating > 10)) {
        res.json({ msg: 'Rating must be between .5 and 10' });
    } else {
        res.json({ 
            msg: 'Thank you for rating',
            status_code: 200
        });
    }
});

// DELETE /movie/{movie_Id}/rating
router.delete('/:movieId/rating', requireJSON, (req, res, next) => {
    res.json({ msg: 'rating deleted' });
});


module.exports = router;
