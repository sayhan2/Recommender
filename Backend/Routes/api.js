const express=require('express');
const axios=require('axios');
const {API_KEY}=require('movies/backend/routes/config');
const userSelections=[];
async function searchMoviesAndTVShows(query) {
  try {
    const results = await Promise.all([
      searchMedia('movie', query),
      searchMedia('tv', query),
    ]);

    return results.flat(); // Flatten the array of results
  } catch (error) {
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
      async function fetchrecs(selectedIds) {
        const allrecs = await Promise.all(
          selectedIds.map((id) => fetchRecommendations(id))
        );
      
        return allrecs.flat(); // Flatten the array of recommendations
      }
async function fetchMediaDetails(id, mediaType){
  const url=`https://api.themoviedb.org/3/${mediaType}/${id}`;
  const params={
    language:'en-US',
  };
  const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  };
  try {
    const response = await axios.get(url, { params, headers });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
  module.exports={
    searchMoviesAndTVShows,
    addUserSelection,
    getUserSelections,
    clearUserSelections,
    fetchrecs,
    fetchMediaDetails,
  };
  async function searchMedia(mediaType, query) {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/${mediaType}`,
      {
        params: {
          query: query,
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
  
    return response.data.results.map((result) => ({
      ...result,
      media_type: mediaType,
    }));
  }
  async function fetchRecommendations(id) {
    const response=await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/recommendations`,
      {
        params:{
          language: 'en-US',
          page:1,
        },
        headers:{
          accept:'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
  
    return response.data.results;
  }
  