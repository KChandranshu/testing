import React, { Component } from 'react';

import './App.css';
import { getInfo, getTopTracks } from './utility';
import Spinner from './UI/Spinner'

class App extends Component {

  state = {
    artistName: "",
    artistInfo: {},
    topTracksInfo: {},
    topTracks: [],
    loading: false
  }

  onArtistChange = e => {
    this.setState({ artistName: e.target.value })
  }

  handleKeyPress = target => {
    if (target.charCode === 13) {
      this.onSubmit()
    }
  }

  onSubmit = () => {
    let artistArray = window.localStorage.getItem('artistArray') !== null ? JSON.parse(window.localStorage.getItem('artistArray')) : [];
    
    if(artistArray.indexOf(this.state.artistName) === -1){
       artistArray.push(this.state.artistName)
       if(artistArray.length > 5){
         artistArray.splice(0, 1)
       }
    }

    window.localStorage.setItem('artistArray',JSON.stringify(artistArray))

    if (this.state.artistName.length !== 0) {
      this.setState({ loading: true })
    }
    getInfo(this.state.artistName)
      .then(res => {
        this.setState({ artistInfo: res });
      })
      .then(res => {
        getTopTracks(this.state.artistName)
          .then(res => {
            this.setState({ topTracksInfo: res })
            let topTracks = [];
            for (let i = 0; i < 10; i++) {
              topTracks.push(this.state.topTracksInfo.toptracks.track[i])
            }
            this.setState({ topTracks: topTracks, loading: false });
          })
      })
  }

  onRecentArtistClick = async name => {
    await this.setState({artistName: name});
    this.onSubmit()
  }

  render() {
    let topTracks = this.state.topTracks.map((track, index) => (
      <div key={index} className="Track">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>{index + 1}.</p>
          <img src={track.image[1]['#text']} alt="Track" />
        </div>
        <div style={{width:'550px', display: 'flex', justifyContent:'space-between' }}>
          <p><a href={track.url}>{track.name}</a></p>
          <p>-</p>
          <p>{track.playcount} Playcount</p>
        </div>
      </div>
    ));
    let similarArtists, dispaly;
    if (typeof this.state.artistInfo.artist !== "undefined") {
      similarArtists = this.state.artistInfo.artist.similar.artist.map((artist, index) => (
        <div key={index} className="SimilarArtist">
          <img src={artist.image[1]['#text']} alt="Artist" />
          <p><a href={artist.url}>{artist.name}</a></p>
        </div>
      ))
    }
    let recent;
    if(window.localStorage.getItem('artistArray') !== null){
      recent = JSON.parse(window.localStorage.getItem('artistArray')).map((artist,index) => (<span className="Recent" key={index} onClick={() => this.onRecentArtistClick(artist)}>{artist} </span>))
    }
    if (this.state.loading) {
      dispaly = <Spinner />
    }
    else {
      dispaly =
        <div>
          {typeof this.state.artistInfo.artist !== "undefined" ?
            <div>
              <div className="Info">
                <h1>Results for searched artist "{this.state.artistInfo.artist.name}"</h1>
                <div className="InfoDetails">
                  <img src={this.state.artistInfo.artist.image[3]["#text"]} alt="Artist" />
                  <div>
                    <p style={{ fontSize: '20px', fontWeight: '600' }}>{this.state.artistInfo.artist.name}</p>
                    <p dangerouslySetInnerHTML={{ __html: this.state.artistInfo.artist.bio.summary }}></p>
                    <p>Listeners : {this.state.artistInfo.artist.stats.listeners}</p>
                    <p>Playcount : {this.state.artistInfo.artist.stats.playcount}</p>
                  </div>
                </div>
              </div>
              <div className="TopTracksSimilarArtists">
                <div className="TopTracks">
                  <h1>Top 10 tracks of {this.state.artistInfo.artist.name}</h1>
                  {topTracks}
                </div>
                <div className="SimilarArtists">
                  <h1>Similar Artists</h1>
                  {similarArtists}
                </div>
              </div>
            </div>
            : null
          }
        </div>
    }
    return (
      <div className="App">
        <div className="SearchDiv">
          <h1>Search for Artist</h1>
          <input type="text" value={this.state.artistName} onKeyPress={this.handleKeyPress} onChange={e => this.onArtistChange(e)} />
          <button onClick={this.onSubmit}>Search</button>
          {window.localStorage.getItem('artistArray') !== null ? <p>Recent search :  {recent}</p> : null}
        </div>
        {dispaly}
      </div>
    )
  }
}

export default App;
