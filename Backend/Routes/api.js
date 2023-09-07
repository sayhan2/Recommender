const express=require('express');
const axios=require('axios');
const {API_KEY}=require('movies/backend/routes/config');
const userSelections=[];
async function searchMoviesAndTVShows(query) {
  try {
    const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params:{
        query: query,
        include_adult: false,
        language: 'en-US',
        page: 1,
      },
      headers: {
        Authorization:`Bearer ${API_KEY}`,
      },
    });
    const tvShowResponse = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
      params: {
        query: query,
        include_adult: false,
        language: 'en-US',
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    const results = [
      ...movieResponse.data.results.map((result) => ({ ...result, media_type: 'movie' })),
      ...tvShowResponse.data.results.map((result) => ({ ...result, media_type: 'tv' })),
    ];

    return results;
  }catch(error){
    console.error(error);
    return [];
  }
}
  function addUserSelection(selection){
        if(userSelections.length<5){//choose up to 5 items
          userSelections.push(selection);
          return true;
        }else{
          return false;
        }
      }
function getUserSelections(){
        return userSelections;
      }
      function clearUserSelections(){
        userSelections.length=0;
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
            Authorization:`Bearer ${API_KEY}`,
        };
        try{
            const response=await axios.get(url,{params,headers});
            allrecs.push(...response.data.results);
        } catch(error){
            console.error(error);
        }
    }
    return allrecs;
}
async function fetchMovieDetails(id) {
    const url=`https://api.themoviedb.org/3/movie/${id}`;
    const params={
        language:'en-US',
    };
    const headers={
        accept:'application/json',
        Authorization:`Bearer ${API_KEY}`,
    };
    try {
        const response=await axios.get(url,{ params,headers });
        return response.data;
    }catch(error){
        console.error(error);
        return null;
    }
}
async function fetchTVShowDetails(showId){
    try{
      const url=`https://api.themoviedb.org/3/tv/${showId}`;
      const params={
        language:'en-US',
      };
      const headers={
        accept: 'application/json',
        Authorization:`Bearer ${API_KEY}`,
      };
      const response=await axios.get(url,{params,headers});
      if(response.data){
        return response.data;
      }else{
        throw new Error('No data found for the TV show.');
      }
    }catch(error){
      console.error(error);
    }
  }
  module.exports = {
    searchMoviesAndTVShows,
    fetchrecs,
    fetchMovieDetails,
    fetchTVShowDetails,
  };
  