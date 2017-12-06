var makeRequest = function(url, callback){
  //create a new XHR
  var request = new XMLHttpRequest();
  //open the request passing in the HTTP request type and the url
  request.open("GET", url);
  //write an event listener for the request
  request.addEventListener("load", callback);
  //GO!
  request.send();
};

var requestComplete = function(){
  if(this.status !== 200) return; //basic error handling to check that it's been found
  var JSONString = this.responseText;
  var countries = JSON.parse(JSONString);
  populateList(countries);
};



var populateList = function(countries){
  var select = document.getElementById('countries-list');
  countries.forEach(function(country, index){
    var option = document.createElement('option');
    option.classList.add("country");
    option.innerText = country.name;
    option.value = index;
    select.appendChild(option);
  });
  var select = document.querySelector("select");
  select.addEventListener("change", function(){
    this.handleSelection(countries);
  }.bind(this));
};

var handleSelection = function(countries){
  var chosen = document.querySelector('select');
  var country = countries[chosen.value];
  this.save(country);
  var ul = document.getElementById('details');
  var name = document.createElement('li');
  var capital = document.createElement('li');
  var population = document.createElement('li');
  var othersInRegion = document.createElement('li');
  var line = document.createElement('li');
  var borderCountries = document.createElement('li');

  var others = []
  countries.forEach(function(eachCountry){
    if(eachCountry.region === country.region){
      others.push(" " + eachCountry.name);
    }
  });
  var bordering = []
  country.borders.forEach(function(country){
    bordering.push(country);
  })

  name.innerHTML = '<span class="label">Name: </span>' + country.name;
  capital.innerHTML = '<span class="label">Capital: </span>' + country.capital;
  population.innerHTML = '<span class="label">Population: </span>'+ country.population;
  borderCountries.innerHTML = '<span class="label">Bordering: </span>' + country.borders;
  othersInRegion.innerHTML = '<span class="label">Others in region: </span>' + others + " ";
  line.innerHTML = '<span class="label">------------------------------</span>';

  ul.appendChild(name);
  ul.appendChild(capital);
  ul.appendChild(population);
  ul.appendChild(borderCountries);
  ul.appendChild(othersInRegion);
  ul.appendChild(line);

  var center = {lat: country.latlng[0], lng: country.latlng[1]};
  var container = document.getElementById("main-map");
  var mainMap = new MapWrapper(container, center, 4);
  mainMap.addMarker(center);
};

var save = function(country){
  var element = JSON.stringify(country);
  localStorage.setItem('country', element);
}

var app = function(){
  var url = "https://restcountries.eu/rest/v2/all";

  makeRequest(url, requestComplete);
  var jsonString = localStorage.getItem('country');
  var savedCountry = JSON.parse(jsonString);


  var ul = document.getElementById('details');
  var name = document.createElement('li');
  var capital = document.createElement('li');
  var population = document.createElement('li');
  var borders = document.createElement('li');
  var line = document.createElement('li');
  name.innerHTML = '<span class="label">Name: </span>' + savedCountry.name;
  capital.innerHTML = '<span class="label">Capital: </span>' + savedCountry.capital;
  population.innerHTML = '<span class="label">Population: </span>' + savedCountry.population;
  borders.innerHTML = '<span class="label">Borders: </span>' + savedCountry.borders;
  line.innerText = "---------------------"


  ul.appendChild(name);
  ul.appendChild(capital);
  ul.appendChild(population);
  ul.appendChild(borders);
  ul.appendChild(line);


  var center = {lat: savedCountry.latlng[0], lng: savedCountry.latlng[1]};
  var container = document.getElementById("main-map");
  var mainMap = new MapWrapper(container, center, 4);
  mainMap.addMarker(center);
}

window.addEventListener('load', app);
