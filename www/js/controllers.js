angular.module('building-blocks.controllers', [])

  .controller('HomeController', function ($scope,$auth, $state, AuthService, News) {
    $scope.news = News.query();
    $scope.go_to_faci = function() {
      $state.go('facilities');
    }
    $scope.go_to_info = function() {
      $state.go('contact');
    }
    $scope.go_to_news = function() {
      $state.go('news');
    }
    $scope.go_to_fel = function() {
      $state.go('help_request');
    }
    $scope.go_to_home = function() {
      $state.go('home');
    }
    $scope.go_to_el = function() {
      $state.go('el');
    }
    $scope.go_to_doc = function() {
      $state.go('doc');
    }
    $scope.handleSignOutBtnClick = function () {
      $auth.signOut()
        .then(function (resp) {
          $state.go('user');
        })
        .catch(function (resp) {
        });
    };
  })

  .controller('NewsController', function ($scope, $state, News) {
    $scope.news = News.query();
    $scope.go_to_home = function() {
      $state.go('home');
    }
  })


  .controller('ElController', function ($scope, $state) {
    $scope.go_to_home = function() {
      $state.go('home');
    }
    $scope.colors = ['#23c1a0', '#ffffff'];



    $scope.labels = ['Förbrukning', 'Tuesday'];
    $scope.data = [
      [65],[40],
    ];


  })


  .controller('BookController', function ($stateParams, $filter, $scope, $state, Facilities, Book, Booking, Block) {
    Book.query($stateParams.booking, function(response) {
      $scope.timeslots = response;
      Facilities.query($stateParams.booking, function(response) {
        $scope.facilities = response;
        Block.query($stateParams.booking, function (response) {
          $scope.blocks = response;
          console.log($scope.timeslots, $scope.blocks, $scope.facilities);
          grabBookedSlots($scope.timeslots, $scope.blocks, $scope.facilities);
        });
      })
      $scope.go_to_faci = function() {
        $state.go('facilities');
      }
    });
    $scope.id = $stateParams.booking.id;

    $scope.date = $filter('date')($stateParams.booking.date, 'yyyy-MM-dd');
    $scope.dateandtime = $filter('date')($stateParams.booking.date, 'yyyy-MM-dd');
    $scope.openDatePicker = function (id, date, start_time) {
      Booking.save({facility_id: id, start_time: date +" "+start_time, name: "tenant"  }, function (response) {
        $scope.message = $scope.facilities.name;
        $scope.messageex = 'Tack för din bokning av ';
        Book.query($stateParams.booking, function(response) {
          $scope.timeslots = response;
          Facilities.query($stateParams.booking, function(response) {
            $scope.facilities = response;
            Block.query($stateParams.booking, function (response) {
              $scope.blocks = response;
              console.log($scope.timeslots, $scope.blocks, $scope.facilities);
              grabBookedSlots($scope.timeslots, $scope.blocks, $scope.facilities);
            });
          })
        });

      });
    };

    function grabBookedSlots(timeslots, blocks) {

      timeslots.forEach(function(timeslot) {

        console.log(timeslot.start_time);

        if (blocks.includes(timeslot)) {
          timeslot.booked = true;
        } else {
          timeslot.booked = false;
        }
      })
    }
  })

  .controller('FacilityController', function ($scope, $q, $state, Facility, ionicDatePicker) {
    $scope.facilities = Facility.query();
    function navigateToPage(date) {
      $state.go('book', {booking: {date: date, id: $scope.id}});
    }
    var ipObj1 = {
      callback: function (val) {  //Mandatory
        var date = new Date(val);
        navigateToPage(date);
      },
      disabledDates: [],
      from: new Date(), //Optional
      to: new Date(2019, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function (id) {
      $scope.id = id;
      ionicDatePicker.openDatePicker(ipObj1)
    };
    $scope.go_to_home = function() {
      $state.go('home');
    }
  })

  .controller('HelpRequestController', function ($scope, $location, $state, HelpRequest) {
    $scope.go_to_home = function() {
      $state.go('home');
    }
    $scope.error = null;
    $scope.help_request = {};
    $scope.createHelpRequest = function () {
      HelpRequest.save($scope.help_request, function (response) {
        $scope.error = null;
        $scope.message = response.message;
      }, function (error) {
        $scope.error = error.data.message;
      });
    }
  })

  .controller('UserController', function ($scope, $auth, $state, AuthService) {
    $scope.registrationData = {};
    $scope.loginData = {};
    $scope.register = true;
    $scope.handleRegBtnClick = function () {
      AuthService.save($scope.registrationData, function (resp) {
          $state.go('home');
        },
        function (error) {
          $scope.errors = error.data.errors.full_messages || error.data.errors;
        })
    }

    $scope.handleLgnBtnClick = function () {
      $auth.submitLogin($scope.loginData)
        .then(function (resp) {
          $state.go('home');
        })
        .catch(function (error) {
          $scope.errors = error.errors;
        });
    }

    $scope.toggleToLgnBtnClick = function () {
      $scope.register = $scope.register !== true;
    };

    $scope.handleSignOutBtnClick = function () {
      $auth.signOut()
        .then(function (resp) {
          $state.go('user');
        })
        .catch(function (resp) {
        });
    };
  });
