console.log('hola mundo!');

/** VARIABLES 
 * const = constantes, variables que no cambian en el tiempo (surgió en ES6)
 * let = variables que cambian en el tiempo (surgió en ES6)
 * var = casi no se van a usar (se usó hasta ES5)
*/

const noCambia = "Daniel";

let cambia = "@DanielVergara";

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}

const getUserAll = new Promise(function(todoBien, todoMal){
  /**
   *TIMERS
   * setInterval =funcion que se va a ejecutar cada cierto tiempo
   * setTimeOut = funcion que se va a ejecutar una sola vez durante un tiempo
   */
  setTimeout(function(){
    //luego de tres segundos
    todoBien('No funciona, como cosa rara')
  },5000)
  
})
const getUser = new Promise(function(todoBien, todoMal){
  /**
   *TIMERS
   * setInterval =funcion que se va a ejecutar cada cierto tiempo
   * setTimeOut = funcion que se va a ejecutar una sola vez durante un tiempo
   */
  setTimeout(function(){
    //luego de tres segundos
    todoBien('No funciona, como cosa rara')
  },3000)
  
})
/*
getUser
  .then(function(){
    console.log("Todo bien")
  })
  .catch(function(message){
    console.log(message)
  })
*/

/*
agrega ambos
Promise.all([
  getUser,
  getUserAll
])*/
/**
 *escoge la primera que se ejecute solamente
 */
Promise.race([
  getUser,
  getUserAll
])

.then()
.catch(function(message){
  console.log(message)
})


/**AJAX: JS y JQuery */
$.ajax('https://randomuser.me/api/',{
  method: 'GET',
  success: function(data){
    console.log(data)
  },
  error: function(error){
    console.log(error)
  }
})

fetch('https://randomuser.me/api/')
  .then(function(response){
    //console.log(response)
    return response.json()
  })
  .then(function(user){
    console.log('user',user.results[0].name.first)
  })
  .catch(function(error){
    console.log(error)
  });

  /**FUNCIONES ASINCRONAS */
  (async function load(){

    async function getData(url){
      const response = await fetch(url)
      const data = await response.json();
      if(data.data.movie_count>0){
        return data;
      }
      throw new Error('No se encontró ningun resultado');
    }

    const $form = document.getElementById('form');
    const $home = document.getElementById('home');
    const $featuringContainer = document.querySelector('#featuring');

    function setAttributes($element, attributes) {
      for(const attribute in attributes) {
        $element.setAttribute(attribute, attributes[attribute]);
      }
    }

    const BASE_API = 'https://yts.am/api/v2/';

    function $featuringTemplate(pelicula){
      return(
        `
        <div class="featuring">
          <div class="featuring-image">
            <img src="${pelicula.medium_cover_image}" width="70" height="100" alt="">
          </div>
          <div class="featuring-content">
            <p class="featuring-title">Pelicula encontrada</p>
            <p class="featuring-album">${pelicula.title}</p>
          </div>
        </div>
      `
      )
    }

    $form.addEventListener('submit',async (event) => {
      event.preventDefault();
      $home.classList.add('search-active');
      const $loader = document.createElement('img');
      setAttributes($loader,{
        src:'src/images/loader.gif',
        height: 50,
        width: 50,
      })
      $featuringContainer.append($loader);
      const data = new FormData($form);
      //desestructuracion de objetos
      try{
        const {
          data: {
            movies: pelicula
          }
        } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
        const HTMLString = $featuringTemplate(pelicula[0]);
        $featuringContainer.innerHTML= HTMLString;
      } catch(error){
        debugger
        alert(error.message);
        $loader.remove()
        $home.classList.remove('search-active');
      }
     
    })

   
    /*
    misma forma de hacer lo de arriba pero con .then y .catch

    let terroList;
    getData('https://yts.am/api/v2/list_movies.json?genre=drama')
      .then(function (data){
        console.log('terroList',data);
        terroList = data;
      })*/
    //console.log('actionList', actionList);
    //console.log('dramaList', dramaList);
    //console.log('animationList', animationList);
    

    /**SELECTORES
     * se coloca ell signo $ en la variable para identificar que ese es un
     * elemento del DOM
     */
    
    
    function videoItemTemplate(movie,category){
      return(
        `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
          <div class="primaryPlaylistItem-image">
            <img src="${movie.medium_cover_image}">
          </div>
          <h4 class="primaryPlaylistItem-title">
            ${movie.title}
          </h4>
        </div>`
      );
    }

    function createTemplate(HTMLString){
      const html = document.implementation.createHTMLDocument();
      html.body.innerHTML = HTMLString;
      return html.body.children[0];
    }

    function addEventClick($element){
      $element.addEventListener('click',()=> { 
        //alert('click');
        showModal($element); 
      });
    }

    function renderMovieList(list, $container, category){
      $container.children[0].remove();
      list.forEach((movie)=> {
        const HTMLString = videoItemTemplate(movie,category);
        const movieElement = createTemplate(HTMLString);
        $container.append(movieElement);
        const image = movieElement.querySelector('img')
        image.addEventListener('load',(event) => {
          event.srcElement.classList.add('fadeIn');
        })
        
        addEventClick(movieElement);
      })
    }

    async function cacheExist(category){
      const listName = `${category}List`
      const cacheList = window.localStorage.getItem(listName);

      if(cacheList){
        return JSON.parse(cacheList);
      }

      const { data: { movies: data }} = await getData(`${BASE_API}list_movies.json?genre=${category}`)
      window.localStorage.setItem(listName,JSON.stringify(data))

      return data;
    }
    
    /**PETICIONES Y RENDER */
    //const {data: {movies: actionList}} = await getData(`${BASE_API}list_movies.json?genre=action`)
    const actionList = await cacheExist('action')
    //window.localStorage.setItem('actionList',JSON.stringify(actionList))
    const $actionContainer = document.querySelector('#action');
    renderMovieList(actionList,$actionContainer,'action');
    
    const dramaList = await cacheExist('drama')
    //window.localStorage.setItem('dramaList',JSON.stringify(dramaList))
    const $dramaContainer = document.querySelector('#drama');
    renderMovieList(dramaList,$dramaContainer,'drama');

    const animationList = await cacheExist('animation')
    //window.localStorage.setItem('animationList',JSON.stringify(animationList))
    const $animationContainer = document.querySelector('#animation');
    renderMovieList(animationList,$animationContainer,'animation');

    




    const $modal = document.getElementById('modal');
    const $overlay = document.getElementById('overlay');
    const $hideModal = document.getElementById('hide-modal');

    const $modalTitle = $modal.querySelector('h1');
    const $modalImage = $modal.querySelector('img');
    const $modalDescription = $modal.querySelector('p');

    function findById(list, id){
      /**En una arrow function si solo vamos a retornar un valor podemos colocarlo asi */
      return list.find((movie)=> movie.id === parseInt(id,10))
    }

    function findMovie(id, category){
      switch(category){
        case 'action':{
          return findById(actionList,id)
        }
        case 'drama':{
          return findById(dramaList,id)
        }
        default: {
          return findById(animationList,id)
        }
      }
    }

    function showModal($element){
      $overlay.classList.add('active');
      $modal.style.animation = 'modalIn .8s forwards';
      const id = $element.dataset.id;
      const category = $element.dataset.category;
      const datos = findMovie(id, category)
      $modalTitle.textContent = datos.title;
      $modalImage.setAttribute('src',datos.medium_cover_image)
      $modalDescription.textContent = datos.description_full;
    }

    $hideModal.addEventListener('click',hideModal);
    function hideModal(){
      $overlay.classList.remove('active');
      $modal.style.animation = 'modalOut .8s forwards';
    }
    
  })()