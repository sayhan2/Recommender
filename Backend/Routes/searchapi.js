const express=require('express');
const axios=require('axios');
const {API_KEY}=require('movies/backend/routes/config');
async function searchMoviesAndTVShows(query){
    try{
      const movieResponse=await axios.get(`https://api.themoviedb.org/3/search/movie`,{
        params:{
          query: query,
          include_adult: false,
          language: 'en-US',
          page: 1,
          authorization: API_KEY,
        },
      });
      const tvShowResponse=await axios.get(`https://api.themoviedb.org/3/search/tv`, {
        params:{
          query:query,
          include_adult: false,
          language:'en-US',
          page:1,
          authorization:API_KEY,
        },
      });
      const bothresults=[
        ...movieResponse.data.results.map(result=>({...result,media_type:'movie'})),
        ...tvShowResponse.data.results.map(result=>({...result,media_type:'tv'})),
      ];
      results.push(...bothresults);
    const selectedIds=results.slice(0,5).map(result=>result.id);
    return selectedIds; //stores ID's of items client searched for, send to recommendation endpoint
}catch(error){
    console.error(error);
    return [];
  }
}
async function fetchrecs(selectedIds){//fetch movie recommendations
    const allrecs=[];
    for(const id of selectedIds){//represents movies sent in to API
        const url=`https://api.themoviedb.org/3/movie/${id}/recommendations`;
        const params={
            language:'en-US',
            page: 1,
        };
        const headers={
            accept: 'application/json',
            Authorization: API_KEY,
        };
        try{
            const response=await axios.get(url,{ params, headers });
            allrecs.push(...response.data.results);
        } catch(error){
            console.error(error);
        }
    }
    return allrecs;
}
const defaultPlaylist=[];
function addToDefaultPlaylist(id){//id represents rec movie to send into playlist
    if(!defaultPlaylist.includes(id)){
        defaultPlaylist.push(id);
        console.log(`Added movie with ID ${id} to the default playlist.`);
    }else{
        console.log(`Movie with ID ${id} is already in the default playlist.`);
    }
}
async function fetchMovieDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const params = {
        language: 'en-US',
    };
    const headers = {
        accept: 'application/json',
        Authorization:API_KEY,
    };
    try {
        const response = await axios.get(url, { params, headers });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}




