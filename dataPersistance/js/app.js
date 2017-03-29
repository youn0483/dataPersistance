angular
  .module('myApp', ['ngRoute', 'firebase'])
  .constant('firebaseConfig', {
    apiKey: "AIzaSyD8aQk09FnrckTaid78yUTTozrnfsVFIpk",
    authDomain: "data-persistence-681c7.firebaseapp.com",
    databaseURL: "https://data-persistence-681c7.firebaseio.com",
    storageBucket: "data-persistence-681c7.appspot.com",
    messagingSenderId: "146793016164"
  })
  .run(firebaseConfig => firebase.initializeApp(firebaseConfig))
  .service('dbRefRoot', DbRefRoot)
  .service('data', Movies)
  .controller('placeholderCtrl', PlaceholderCtrl)
  .controller('detailsCtrl', DetailsCtrl)
  .controller('navCtrl', NavCtrl)
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/placeholder.html',
        controller: 'placeholderCtrl'
      })
      .when('/details/:itemID', {
        templateUrl: 'views/details.html',
        controller: 'detailsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  })

function DbRefRoot() {
  return firebase.database().ref()
}

function Movies(dbRefRoot, $firebaseObject, $firebaseArray) {
  const dbRefMovie = dbRefRoot.child('data')

  this.get = function get(id) {
    return $firebaseObject(dbRefMovie.child(id))
  }

  this.getAll = function getAll() {
    return $firebaseArray(dbRefMovie)
  }
}

function PlaceholderCtrl($scope) {
  $scope.itemID = null
}

function DetailsCtrl($scope, $routeParams, $location, data) {

  this.movie = data.get($routeParams.itemID)
  
  
}


function NavCtrl(data) {

  this.clearForm = function clearForm() {
    return {
      name: '',
      description: '',
      image: '',
      imageAlt: '',
      id: '',
      director: '',
      stars: '',
    }
  }

  this.newMovie = this.clearForm()

 

  this.movie = data.get('id')

  this.data = data.getAll()

  this.remove = function remove(movie) {
    if (confirm("Are you sure you wish to Delete a movie?")) {
      console.log('remove button clicked')
      this.data.$remove(movie)
    }
  }

  this.save = function save(movie) {
    this.data.$save(movie)
  
  }

  this.addMovie = function addMovie(newMovie) {
    this.newMovie.id = cuid()
    this.data.$add(newMovie)
      .then(newRef => {
        $('#addMovieModal').modal('hide')
        this.newMovie = this.clearForm()
      })
  }
}
