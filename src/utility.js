import axios from 'axios';

const getInfo = (artistName) => {
    return new Promise((resolve, reject) => {
        let url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=3cac9a33aae5f96f0295793a383b6e9a&format=json`;
        axios.get(url)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

const getTopTracks = (artistName) => {
    return new Promise((resolve, reject) => {
        let url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artistName}&api_key=3cac9a33aae5f96f0295793a383b6e9a&format=json`;
        axios.get(url)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}

export { getInfo, getTopTracks }