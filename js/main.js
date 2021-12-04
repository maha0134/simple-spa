//app is for general control over the application
//and connections between the other components
"use strict"
let apiKey
let baseUrl
let instructions
let actors
let media
let baseImgUrl

const APP = {
  init: () => {
    
    apiKey = "?api_key=662a9f5f9bd7ca76976bbb8b24822ddd"
    baseUrl = "https://api.themoviedb.org/3/"
    instructions = document.getElementById("instructions")
    actors = document.getElementById("actors")
    media = document.getElementById("media")
    
    let url = baseUrl + 'configuration' + apiKey
    
    fetch(url).then(response => {
      if(!response.ok) {
        throw new Error("Error", response.status,response.statusText)
      }
    return response.json()
    }).then(data=> {
      baseImgUrl = data.images.secure_base_url
      let searchBarContent = document.getElementById("search-bar")
      searchBarContent.addEventListener('submit', (event) =>{
        event.preventDefault()
        if(searchBarContent.search.value) {
          SEARCH.results(searchBarContent.search.value)
        }
      })
    }).catch(err => {
      console.log(err.message)
    }) 
  }
}

//search is for anything to do with the fetch api
const SEARCH = {
  results: (query)=> {
        let searchUrl = baseUrl + 'search/person' + apiKey + '&query=' + query
        fetch(searchUrl).then(response => {
          if(!response.ok) {
            throw new Error("Error", response.status,response.statusText)
          }
          return response.json()
        }).then(data => {
          instructions.classList.remove("active")
          media.classList.remove("active")
          actors.className= "active"
          let results = JSON.stringify(data) //saving the results
          ACTORS.display(data)
        }).catch(err => {
          console.log(err.message)
        })
      }
    }

//actors is for changes connected to content in the actors section
const ACTORS = {
  display: (data)=> {
    let content=document.getElementById('actor-content')
    content.innerHTML = ""          //to clear any existing fetch displayed
    data.results.forEach(element=> {
      let card = document.createElement('div')
      card.className = "card"
      let imgWrapper = document.createElement('div')
      imgWrapper.className = "img-wrap"
      card.append(imgWrapper)
      if(element.profile_path) {        //in case images are not found
        let profilePic = document.createElement('img')
        profilePic.src = baseImgUrl+'w185'+element.profile_path
        profilePic.alt = "picture of " + element.name
        imgWrapper.append(profilePic)
      }
      let info = document.createElement('div')
      info.className="info-display"
      let details = document.createElement('p')
      details.setAttribute("data-id",element.id)
      details.textContent= element.name
      let popularity = document.createElement('p')
      popularity.textContent="Rating: "+element.popularity
      info.append(details)
      info.append(popularity)
      card.append(info)
      content.append(card)
      card.addEventListener('click', ()=> MEDIA.displayMedia(element))
      })
  }
};

//media is for changes connected to content in the media section
const MEDIA = {
  displayMedia: (element) => {
        actors.classList.toggle("active")
        media.classList.toggle("active")
        let content=document.getElementById('media-content')
        content.innerHTML=""
        let title=document.createElement('p')
        title.className="title-text"
        title.textContent = element.name+" is known for"
        content.append(title)
        element.known_for.forEach(value => {
          let card = document.createElement('div')
          card.className = "card"
          let imgWrapper = document.createElement('div')
          imgWrapper.className = "img-wrap"
          card.append(imgWrapper)
          let info = document.createElement('div')
          info.className="info-display"
          let name = document.createElement('p')
          name.setAttribute("data-id",value.id)
          let year = document.createElement('p')
          if(value.media_type ==="tv") {
            if(value.poster_path) {        //in case images are not found
              let posterPic = document.createElement('img')
              posterPic.src = baseImgUrl+'w185'+value.poster_path
              posterPic.alt = "poster of " + value.name
              imgWrapper.append(posterPic)
            }
            name.textContent= value.name
            let firstAirDate = value.first_air_date.slice(0,4)
            year.textContent="( "+firstAirDate+" )"
          } else {
            if(value.poster_path) {        //in case images are not found
              let posterPic = document.createElement('img')
              posterPic.src = baseImgUrl+'w185'+value.poster_path
              posterPic.alt = "poster of " + value.name
              imgWrapper.append(posterPic)
            }
            name.textContent= value.title
            let releaseDate = value.release_date.slice(0,4)
            year.textContent="( "+releaseDate +" )"
          }
          info.append(name)
          info.append(year)
          card.append(info)
          content.append(card)
        })
        let btn = document.getElementById("back-btn")
        btn.addEventListener('click', ()=> {
          media.classList.remove("active")
          actors.className="active"
        })
  }
};

//storage is for working with localstorage
// const STORAGE = {
//   //this will be used in Assign 4
// };

//nav is for anything connected to the history api and location
// const NAV = {
//   //this will be used in Assign 4
// };

//Start everything running

document.addEventListener('DOMContentLoaded',APP.init());