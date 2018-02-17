$(document).ready(function () {
  $.ajax({
    url: '/maps',
    method: 'GET',
    success: function (maps) {
      initialRender();
      renderMapElements(maps);
    }
  })



  /* ----- Functions ----- */

  fontsize = function () {
    var fontSize = $(".sidebar_title").width() * 0.10;
    $(".header_text").css('font-size', fontSize);
  };
  // $(window).resize(fontsize);


  function initialRender() {
    $(".sidebar_back").css("display", "none");
    let map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 30, lng: 0 },
      zoom: 2
    });
  }


  function initMapNoMarker(maps) {
    mylatLng = { lat: 43.6446, lng: -79.3952 }

    var mapOptions = {
      center: mylatLng,
      zoom: 6 // this is from mapID
    }

    var bounds = new google.maps.LatLngBounds();

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);


    for (var i = 0; i < maps.markers.length; i++) {

      (function (i) {

        var position = new google.maps.LatLng(maps.markers[i].lat, maps.markers[i].lng);
        bounds.extend(position);

        var marker = new google.maps.Marker({
          position: position,
          map: map,
        });

        var infoWindow = new google.maps.InfoWindow({ content: maps.markers[i].description, position: position });


        marker.addListener('click', function () {
          infoWindow.open(map, marker);
        });

      })(i)
    }
    map.fitBounds(bounds);       //# auto-zoom
    map.panToBounds(bounds);     // # auto-center
  }


  function initMapWithMarker() {
    function addMarker(props) {
      var marker = new google.maps.Marker({
        position: props.coords,
        map: map,
      });
      var infoWindow = new google.maps.InfoWindow({ content: props.description, position: props.coords });
      marker.addListener('click', function () {
        infoWindow.open(map, marker);
      })
      return marker;
    }

    var mapOptions = {
      center: { lat: 0, lng: 0 }, // this is from mapID
      zoom: 2
    }

    var newMarker;
    var bounds = new google.maps.LatLngBounds();
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // listen for a click and run function addMarker on a click:
    google.maps.event.addListener(map, 'click', function (event) {
      if (newMarker) {
        newMarker.setMap(null)
      };

      newMarker = addMarker({ coords: event.latLng });
      $(".marker_lat").val(event.latLng.lat);
      $(".marker_lng").val(event.latLng.lng);
    });

    $(".element_container").on('click', ".save_marker", function (event) {
      event.preventDefault();
      var savedMarker = newMarker
      newMarker = null;
    });
  }


  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }


  function createMapElement(obj) {
    let mapId = obj.id;
    let mapTitle = obj.title;
    let map_image = 'http://freedesignfile.com/upload/2017/08/earth-icon-vector.png';

    let mapElement = (`
    <article class="map_element" id="mapidcarrier" data-mapid="${mapId}">
    <img class="location_pic" src="${map_image}">
      <span class="map_element_title"> ${mapTitle} </span>
      <button type="button" id="favourite-map" class="btn btn-secondary btn-sm">Add to Favourites</button>
    </article>
    `)
    return mapElement;
  }


  function renderMapElements(array) {
    let mapHeader = (`
    <h1 class="header_text">Explore Your World</h1>
    `)
    $(".sidebar_title").empty();
    $(".sidebar_title").append(mapHeader);

    $('.element_container').append('<h6 id="popular_maps">Popular Maps</h6>')
    let popular_maps = [];
    for (item of array) {
      if (item.id <= 5) {
        popular_maps.push(item);
      }
    }
    for (map of popular_maps) { // point is an object within an array
      // console.log(map)
      $(".element_container").append(createMapElement(map));
    }
  }


  function renderFavouriteMaps(obj) {
    $("remove_favourite").css("display", "block");
    $('.favourite_maps').append('<h6 id="favourite_maps">Favourite Maps</h6>')
    for (map of obj.favourites) { //obj.favourites is an array
      $(".favourite_maps").append(createMapElement(map));
    }
  }


  function renderUserMaps(obj) {
    $("delete_map").css("display", "block");
    $('.user_maps').append('<h6 id="user_maps">User Maps</h6>')
    for (map of obj.maps) { //obj.maps is an array, this points to the maps generated by the user
      $(".user_maps").append(createMapElement(map));
    }
  }


  function createLocationElement(marker) {
    let point_Id = marker.id;
    let point_label = marker.label;
    let point_description = marker.description;
    let point_image = 'http://freedesignfile.com/upload/2017/08/earth-icon-vector.png';
    // if (marker.image) {
    //   point_image = marker.image;
    // }

    pointElement = (`
      <article class="point_element" data-pointid="${escape(point_Id)}">
      <img class="location_pic" src="${point_image}">
      <span class="point_element_description"> ${escape(point_label)} </span>
      </article>
    `);
    return pointElement;
  };


  function createLocationElementPlus(marker) { //this function renders location elements along with edit and delete button along each of them, this function is only used in renderUserLocationElements
    let point_Id = marker.id;
    let point_label = marker.label;
    let point_description = marker.description;
    let point_image = 'http://freedesignfile.com/upload/2017/08/earth-icon-vector.png';
    // if(marker.image) {
    //   point_image = marker.image;
    // }

    pointElement = (`
      <article class="point_element" data-pointid="${escape(point_Id)}">
      <img class="location_pic" src="${point_image}">
      <span class="point_element_description"> ${escape(point_label)} </span>

      <button type="button" class="delete_marker btn btn-secondary btn-sm">Delete</button>
      <button type="button" class="edit_marker btn btn-secondary btn-sm">Edit</button>
      </article>
    `);
    return pointElement;
  };


  function renderLocationElements(obj) {
    let mapTitle = obj.title;
    let mapHeader = (`
      <h1 class="header_text" id="mapidcarrier" data-mapid=${obj.id}>${escape(mapTitle)}</h1>
    `)
    $(".sidebar_title").empty();
    // var fontSize = $(".sidebar_title").width() * 0.10;
    // console.log(fontSize)
    // $(".sidebar_title").css('font-size', "12px");
    $(".sidebar_title").append(mapHeader);

    console.log("list of markers to be rendered: " + obj.markers)
    for (point of obj.markers) { // point is an object within an array
      $(".element_container").append(createLocationElement(point)); //render location elements to one of three div container: element_container(for hard-coded maps), user_maps(for user-created maps), favourite_maps(for favourited maps). The other 2 div will be empty
    }
  }


  function renderUserLocationElements(obj) {
    let mapTitle = obj.title;
    let mapId = obj.id;
    let mapHeader = (`
      <h1 class="header_text" id="mapidcarrier" data-mapid=${mapId}>${escape(mapTitle)}</h1>
    `)
    $(".sidebar_title").empty();
    $(".sidebar_title").append(mapHeader);

    console.log("list of markers to be rendered: " + obj.markers)
    for (point of obj.markers) {
      $(".user_maps").append(createLocationElementPlus(point)); //render location elements to one of three div container: element_container(for hard-coded maps), user_maps(for user-created maps), favourite_maps(for favourited maps). The other 2 div will be empty
    }
  }


  function renderFavouriteLocationElements(obj) {
    let mapTitle = obj.title;
    let mapHeader = (`
      <h1 class="header_text">${escape(mapTitle)}</h1>
    `)
    $(".sidebar_title").empty();
    $(".sidebar_title").append(mapHeader);

    for (point of obj.markers) {
      $(".favourite_maps").append(createLocationElement(point)); //render location elements to one of three div container: element_container(for hard-coded maps), user_maps(for user-created maps), favourite_maps(for favourited maps). The other 2 div will be empty
    }
  }



  /* ----- Event Listeners ----- */

  $('.reg').on('click', function (event) {
    $.ajax({
      url: '/api/users/register',
      method: 'POST',
      data: {
        name: $('.username').val(),
        password: $('.password').val(),
        success: function () {
          $('.user_info').append('<p id="reg-message">Registration complete, please log in.</p>');
          $('.username, .password').val('');
        }
      }
    })
  });


  $('.login').on('click', function (event) {
    event.preventDefault();
    $.ajax({
      url: '/api/users/login',
      method: 'POST',
      data: {
        name: $('.username').val(),
        password: $('.password').val()
      },
      success: function (profile) {
        $('.username').css("display", "none");
        $('.password').css("display", "none");
        $('.btn.login').css("display", "none");
        $('.btn.reg').css("display", "none");
        $('.element_container').empty();
        $('#reg-message').empty();
        $('.user_maps').empty();
        $('.favourite_maps').empty();
        $('.logout').css('display', 'inline');
        $('.user_info').append(`<h4 id='custom'>Logged in as: ${profile.user}.</h4>`);
        renderUserMaps(profile);
        renderFavouriteMaps(profile);
        $.ajax({
          url: '/maps',
          method: 'GET',
          success: function (maps) {
            initialRender();
            renderMapElements(maps);
          }
        })
      }
    })
  });


  $('.logout').on('click', function (event) {
    $.ajax({
      url: '/api/users/logout',
      method: 'POST',
      success: function () {
        $.ajax({
          url: '/maps',
          method: 'GET',
          success: function (maps) {
            $('.element_container').empty();
            $('.user_maps').empty();
            $('.favourite_maps').empty();
            $('.logout').css('display', 'none');
            $('.h4#custom').css('display', 'none');
            $('#custom').text('');
            $('.username').css("display", "inline");
            $('.username').val('');
            $('.password').css("display", "inline");
            $('.password').val('');
            $('.btn.login').css("display", "inline");
            $('.btn.reg').css("display", "inline");
            initialRender();
            renderMapElements(maps);
          }
        })
      }
    })
  });


  //on click (of "sidebar_back" button), render "home page"
  $(".sidebar_header").on('click', ".sidebar_back", function (event) {
    event.preventDefault();
    if (!$('.username').val() && !$('.password').val()) {
      $(".create_map").css("display", "block");
      $('.element_container').empty();
      $('.user_maps').empty();
      $('.favourite_maps').empty();
      $.ajax({
        url: '/maps',
        method: 'GET',
        success: function (maps) {
          initialRender();
          renderMapElements(maps);
        }
      })
    } else {
      $.ajax({
        url: '/api/users/login',
        method: 'POST',
        data: {
          name: $('.username').val(),
          password: $('.password').val()
        },
        success: function (profile) {
          $(".create_map").css("display", "block");
          $('.username').css("display", "none");
          $('.password').css("display", "none");
          $('.btn.login').css("display", "none");
          $('.btn.reg').css("display", "none");
          $('.element_container').empty();
          $('#reg-message').empty();
          $('.user_maps').empty();
          $('.favourite_maps').empty();
          $('.logout').css('display', 'inline');

          renderUserMaps(profile);
          renderFavouriteMaps(profile);
          $.ajax({
            url: '/maps',
            method: 'GET',
            success: function (maps) {
              initialRender();
              renderMapElements(maps);
            }
          })
        }
      })
    }
  })


  $('.element_container').on('click', '#favourite-map', function (event) {
    event.preventDefault();
    console.log("clicked favourite")
    let mapID = $(event.target).closest('#mapidcarrier').data('mapid');
    console.log(mapID);
    $.ajax({
      url: '/maps/favourite',
      method: 'POST',
      data: {
        map_id: mapID
      },
      success: function () {
        console.log('Favourite added');
      }
    })
  });


  //on click (of a hard-coded/seed map), render location elements and markers
  $('.element_container').on('click', ".map_element", function (event) {
    console.log("map of popular maps clicked")
    $('.element_container').empty();
    $('.user_maps').empty();
    $('.favourite_maps').empty();

    $('.sidebar_back').css("display", "block")

    let mapID = $(event.target).closest('article').data("mapid");
    console.log("mapID: " + mapID)
    $.ajax({
      method: "GET",
      url: "/maps/search/" + mapID,
      success: function (map) {
        console.log("map (to success): " + map)
        initMapNoMarker(map);
        renderUserLocationElements(map);
      }
    })
  })


  //on click (of a user-created map), render location elements and markers
  $('.user_maps').on('click', ".map_element", function (event) {
    console.log("map of user maps clicked")
    $('.element_container').empty();
    $('.user_maps').empty();
    $('.favourite_maps').empty();

    $('.sidebar_back').css("display", "block")

    let mapID = $(event.target).closest('article').data("mapid");
    console.log("mapID: " + mapID)
    $.ajax({
      method: "GET",
      url: "/maps/search/" + mapID,
      success: function (map) {
        console.log("map (to success): " + map)
        initMapNoMarker(map);
        renderUserLocationElements(map);
      }
    })
  })


  //on click (of a favourited map), render location elements and markers
  $('.favourite_maps').on('click', ".map_element", function (event) {
    console.log("map of favourite maps clicked")
    $('.element_container').empty();
    $('.user_maps').empty();
    $('.favourite_maps').empty();
    $('.sidebar_back').css("display", "block")

    let mapID = $(event.target).closest('article').data("mapid");
    $.ajax({
      method: "GET",
      url: "/maps/search/" + mapID,
      success: function (map) {
        $('.element_container').empty();
        $('.user_maps').empty();
        $('.favourite_maps').empty();
        // console.log(map);
        initMapNoMarker(map);
        renderLocationElements(map);
      }
    })
  })


  //on click (of "Create a Map" button), append/display form to sidebar
  $(".sidebar_header").on('click', ".create_map", function () {
    if (!$('.username').val() && !$('.password').val()) {
      alert("Please Log In");
    } else {

    $(this).css("display", "none");
    $('.sidebar_back').css("display", "block")
    $('.element_container').empty();
    $('.user_maps').empty();
    $('.favourite_maps').empty();

    let map_form = (`
      <div class="new_map">
      <form>
      <textarea class="map_name" name="map_name" placeholder="Map Name"></textarea>
      <textarea class="map_image" name="map_image" placeholder="Map Image URL"></textarea>

      <button type="button" class="btn btn-outline-dark next btn-sm">Next</button>
      <button type="button" class="btn btn-outline-dark cancel_map btn-sm">Cancel</button>

      </form>
      </div>
      `)
    $(".element_container").append(map_form);
    }
  })


  //on click (of "Next" button), allow user to add markers, and display form for marker's details
  $(".element_container").on('click', ".next", function (event) {
    event.preventDefault();
    if ($(".map_name").val().length === 0) {
      alert("Please Enter Map Name")
    } else {
      $.ajax({
        method: "POST",

        url: "/maps/new",
        data: {
          title: $(".map_name").val(),
          map_image: $(".map_image").val()
        },
        success: function (obj) {
          let mapTitle = obj.title;
          let mapHeader = (`
            <h1 class="header_text" id="current-map" data-mapid=${obj.id}>${escape(mapTitle)}</h1>
          `)
          $(".sidebar_title").empty();
          $(".sidebar_title").append(mapHeader);
        }

      })
      initMapWithMarker();
      $(".element_container").empty();
      $('.user_maps').empty();
      $('.favourite_maps').empty();
      let marker_form = (`
      <div class="marker_form">
      <form>
      <textarea class="marker_name" name="marker_name" placeholder="Name"></textarea>
      <textarea class="marker_details"name="marker_details" placeholder="City/Country"></textarea>
      <textarea class="marker_image"name="marker_image" placeholder="Image URL"></textarea>
      <textarea class="marker_description" name="marker_description" placeholder="Description"></textarea>
      <textarea class="marker_lat" name="marker_lat" placeholder="Latitude"></textarea>
      <textarea class="marker_lng" name="marker_lng" placeholder="Longitude"></textarea>

      <button type="button" class="btn btn-outline-dark save_marker btn-sm">Save</button>
      <button type="button" class="btn btn-outline-dark cancel_map btn-sm">Cancel</button>
      
      </form>
      </div>



      `)
      $(".element_container").append(marker_form);
    }
  })


  //on click (of "save marker" button), POST marker data to /marker 
  $(".element_container").on('click', ".save_marker", function (event) {
    event.preventDefault();

    let mapID = $('.header_text').data("mapid"); 
    $.ajax({
      method: "POST",
      url: "/maps/marker",
      data: {
        label: $(".marker_name").val(),
        map_id: mapID,
        city: $(".marker_details").val(),
        lat: $(".marker_lat").val(),
        lng: $(".marker_lng").val(),
        description: $(".marker_description").val(),
      },
      success: function () {
        console.log(mapID);
        console.log("marker name: " + $(".marker_name").val())
      }
    })
    $("textarea.marker_name").val('')
    $("textarea.marker_details").val('')
    $("textarea.marker_image").val('')
    $("textarea.marker_description").val('')
    $("textarea.marker_lat").val('')
    $("textarea.marker_lng").val('')
  })



  //on click (of "edit marker" button) inside a specific user-created map, display form to edit that marker's data
  $('.user_maps').on('click', ".edit_marker", function (event) {
    let mapID = $('#mapidcarrier').data('mapid');
    let pointID = $(event.target).closest('article').data('pointid');
    $('.element_container').empty();
    $('.user_maps').empty();
    $('.favourite_maps').empty();

    $.ajax({
      method: "GET",
      url: "/maps/marker/search/" + pointID,
      success: function (point) {
        let marker_id = point.id;
        let marker_name = point.label;
        let marker_details = point.city;
        let marker_image = point.image;
        let marker_description = point.description;
        let marker_lat = point.lat;
        let marker_lng = point.lng;

        let marker_form = (`
          <div class="marker_form">
          <form>
          <textarea class="marker_id" style="display:none">${marker_id}</textarea>
          <textarea class="marker_name" name="marker_name" placeholder="Name">${marker_name}</textarea>
          <textarea class="marker_details"name="marker_details" placeholder="City/Country">${marker_details}</textarea>
          <textarea class="marker_image"name="marker_image" placeholder="Image URL">${marker_image}</textarea>
          <textarea class="marker_description" name="marker_description" placeholder="Description">${marker_description}</textarea>
          <textarea class="marker_lat" name="marker_lat" placeholder="Latitude">${marker_lat}</textarea>
          <textarea class="marker_lng" name="marker_lng" placeholder="Longitude">${marker_lng}</textarea>
          
          <button type="button" class="save_edited_marker btn btn-outline-dark btn-sm" data-mapid=${mapID} data-pointid=${pointID}>Save</button>
          <button type="button" class="btn btn-outline-dark cancel_map btn-sm">Cancel</button>
          </form>
          </div>
          `)
        $(".element_container").append(marker_form);
      }
    })
  })


  //on click (of "save edited marker" button), PUT edited marker data to /maps/marker/edit/:id
  //then render/refresh the map and list of locations 
  $('.element_container').on('click', ".save_edited_marker", function (event) {
    event.preventDefault();

    let mapID = $('#mapidcarrier').data("mapid");
    let pointID = $(".marker_id").val();
    console.log(mapID + '\n' + pointID);
    $.ajax({
      method: "PUT",
      url: "/maps/marker/edit/" + pointID,
      data: {
        label: $(".marker_name").val(),
        city: $(".marker_details").val(),
        lat: $(".marker_lat").val(),
        lng: $(".marker_lng").val(),
        description: $(".marker_description").val(),
        image: $(".marker_image").val()
      },
      success: function () {
        $.ajax({
          method: "GET",
          url: "/maps/search/" + mapID,
          success: function (map) {
            $.ajax({
              method: "GET",
              url: "/maps/search/" + mapID,
              success: function (map) {
                $(".element_container").empty();
                $('.user_maps').empty();
                $('.favourite_maps').empty();
                initMapNoMarker(map);
                renderUserLocationElements(map);
              }
            })
          }
        })
      }
    })
  })


  //on click (of "delete marker" button), delete a marker
  //then render/refresh the map and list of locations 
  $('.user_maps').on('click', ".delete_marker", function (event) {
    event.preventDefault();
    $(".element_container").empty();
    $('.user_maps').empty();
    $('.favourite_maps').empty();


    let mapID = $('#mapidcarrier').data("mapid");
    let pointID = $(event.target).closest('article').data("pointid");
    console.log(mapID + '\n' + pointID);

    $.ajax({
      method: "DELETE",
      url: "/maps/marker/delete/" + pointID,
      success: function () {
        $.ajax({
          method: "GET",
          url: "/maps/search/" + mapID,
          success: function (map) {
            initMapNoMarker(map);
            renderUserLocationElements(map);
          }
        })
      }
    })
  })


  //on click (of "delete map" button), delete map
  //then render/refresh "home page" 
  $('.user_maps').on('click', ".delete_map", function (event) {
    $('.element_container').empty();
    $(this).css("display", "none");

    let mapID = $(event.target).closest('article').data("mapid");
    $.ajax({
      method: "DELETE",
      url: "/maps/delete/" + mapID,
      success: function (map) {
        initialRender();
        renderMapElements(maps);
        renderFavouriteMaps(maps);
        renderUserMaps(maps);
      }
    })
  })


  //on click (of "cancel" button)
  //clear container, show list of maps page ("home page")
  $(".element_container").on('click', '.cancel_map', function (event) {
    event.preventDefault();
    $.ajax({
      url: '/api/users/login',
      method: 'POST',
      data: {
        name: $('.username').val(),
        password: $('.password').val()
      },
      success: function (profile) {
        $('.username').css("display", "none");
        $('.password').css("display", "none");
        $('.btn.login').css("display", "none");
        $('.btn.reg').css("display", "none");
        $('.element_container').empty();
        $('#reg-message').empty();
        $('.user_maps').empty();
        $('.favourite_maps').empty();
        $('.logout').css('display', 'inline');

        renderUserMaps(profile);
        renderFavouriteMaps(profile);
        $.ajax({
          url: '/maps',
          method: 'GET',
          success: function (maps) {
            initialRender();
            renderMapElements(maps);
          }
        })
      }
    })
  })

}) //end of document.ready

