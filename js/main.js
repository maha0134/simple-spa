"use strict"
let apiKey="?api_key=662a9f5f9bd7ca76976bbb8b24822ddd"
let baseUrl="https://api.themoviedb.org/3/"
let instructions = document.getElementById("instructions")
let  actors = document.getElementById("actors")
let media = document.getElementById("media")
let  sort = document.getElementById("sort")
let searchBarContent=document.getElementById("search-bar")
let baseImgUrl
let nameSort
let popularitySort

const APP = {
  init: () => {
    NAV.setPage(false)
    window.addEventListener("popstate",NAV.setPage)
    let url = baseUrl + 'configuration' + apiKey
    fetch(url).then(response => {
      if(!response.ok) {
        throw new Error("Error", response.status,response.statusText)
      }
    return response.json()
    }).then(data=> {
      baseImgUrl = data.images.secure_base_url
      searchBarContent.addEventListener('submit', (event) => {
        event.preventDefault()
        if(searchBarContent.search.value) {
          NAV.setPage(false,searchBarContent.search.value)
        }
      })
    }).catch(err => {
      actors.innerHTML=""
      actors.innerHTML=`<h1>${err.message}</h1>`
    })
    
  }
}

//search is for anything to do with the fetch api
const SEARCH = {
  results: (query)=> {
    let checkData=localStorage.getItem(query)
    if(checkData) {
      let retrievedData = JSON.parse(checkData)
      ACTORS.display(retrievedData,query)
    } else {
        let searchUrl = baseUrl + 'search/person' + apiKey + '&query=' + query
        fetch(searchUrl).then(response => {
          if(!response.ok) {
            throw new Error("Error", response.status,response.statusText)
          }
        return response.json()
      }).then(data => {
          let results = JSON.stringify(data) //saving the results
          localStorage.setItem(query,results)
          ACTORS.display(data,query)
        }).catch(err => {
            actors.innerHTML=""
            actors.innerHTML=`<h1>${err.message}</h1>`
        })
    }
  }
}

//actors is for changes connected to content in the actors section
const ACTORS = {
  display: (data,query)=> {
    NAV.showPage(actors)
    nameSort=document.getElementById("name-sort")
    nameSort.addEventListener("click", ACTORS.sortName)
    popularitySort=document.getElementById("popularity-sort")
    popularitySort.addEventListener("click",ACTORS.sortPopularity)
    let content=document.getElementById('actor-content')
    content.innerHTML = ""          //to clear any existing fetch displayed
    data.results.forEach(element=> {
      let cardLink = document.createElement("a")
      cardLink.href=location.href+"/"+element.id
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
      details.className="name"
      details.textContent= element.name
      let popularity = document.createElement('p')
      popularity.textContent="Rating: "
      let span=document.createElement("span")
      span.className="rating"
      span.textContent=element.popularity
      popularity.append(span)
      info.append(details)
      info.append(popularity)
      card.append(info)
      cardLink.append(card)
      content.append(cardLink)
      cardLink.addEventListener('click',(event)=> {
        event.preventDefault()
        NAV.mediaPage(element.id)
        MEDIA.displayMedia(element)
      })
    })
  },

  sortName: (ev)=> {
    ev.preventDefault()
    let list = document.getElementById("actor-content")
    let target = Array.from(list.querySelectorAll("p.name"))
    if(list.classList.contains("sorted-name")) {
      list.classList.remove("sorted-name")
      target.sort((a,b)=> {
        if(a.innerHTML.toLowerCase()<b.innerHTML.toLowerCase()) {
          return 1
        } 
        else if(a.innerHTML.toLowerCase()>b.innerHTML.toLowerCase()) {
          return -1
        }
        return 0
      })
    }
    else {
      list.classList.add("sorted-name")
      target.sort((a,b)=> {
        if(a.innerHTML.toLowerCase()>b.innerHTML.toLowerCase()) {
          return 1
        } 
        else if(a.innerHTML.toLowerCase()<b.innerHTML.toLowerCase()) {
          return -1
        }
        return 0
      })
    }
      target.forEach(element=> {
        list.append(element.parentNode.parentNode.parentNode)
      })
  },

  sortPopularity: (ev)=> {
    ev.preventDefault()
    let list = document.getElementById("actor-content")
    let target = Array.from(list.querySelectorAll("span.rating"))
    if(list.classList.contains("sorted-rating")) {
      list.classList.remove("sorted-rating")
      target.sort((a,b)=> {
        return a.innerHTML - b.innerHTML
      })
    }
    else {
      list.classList.add("sorted-rating")
      target.sort((a,b)=> {
      return b.innerHTML - a.innerHTML
      })
    }
    target.forEach(element=> {
      list.append(element.parentNode.parentNode.parentNode.parentNode) //didn't want to change my CSS, apologies for the ugly repetition, the CSS made me do it
    })
  }
};

//media is for changes connected to content in the media section
const MEDIA = {
  displayMedia: (element) => {
    NAV.showPage(media)
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
    btn.addEventListener('click', (ev)=> {
      ev.preventDefault()
      NAV.showPage(actors)
      let goBack=location.hash.split("/")[0]
      location.hash=goBack
    })
  }
};

//nav is for anything connected to the history api and location
const NAV = {
  setPage: (ev,query)=> {
      //first load/every reload/back to home page
      if(!ev&&!query || (ev && !location.hash)) {
          history.replaceState({},"","#")
          document.title="Home Page"
          NAV.showPage(instructions)
          searchBarContent.search.value=""
      } else if(!ev&&query) {   //when search is made on searchbar
        SEARCH.results(query)
        location.hash=query
      } else {                  
        if(location.hash.includes("/")) { //back or forward button
          NAV.showPage(media)
        }else {                           //if new query is typed in address bar
          let hash=location.hash.replace("#","")
          document.title="Search- "+hash[0].toUpperCase()+hash.slice(1) //to capitalize first letter referred to: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
          SEARCH.results(hash)
        }
      }
    },
  
    mediaPage: (elementId)=> {
    location.hash+="/"+elementId
    document.title="TV Shows and Movies"
  },
  
  showPage: (target)=> {
    document.querySelectorAll(".active").forEach(element=>element.classList.remove("active"))
    if(target===actors) {
      sort.classList.add("active")
    }
    target.classList.add("active")
  }
};

document.addEventListener('DOMContentLoaded',APP.init());