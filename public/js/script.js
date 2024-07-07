// navbar

let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
}




// vanilla JS
var toTop = document.getElementById("goto-topJS");

  toTop.addEventListener("click", function(){
  scrollToTop(4000);
});
function scrollToTop(scrollDuration) {
    var scrollStep = -window.scrollY / (scrollDuration / 5),
        scrollInterval = setInterval(function(){
        if ( window.scrollY != 0 ) {
            window.scrollBy( 0, scrollStep );
        }
        else clearInterval(scrollInterval);
    },15);
}




    document.addEventListener('DOMContentLoaded', function () {
      var currentYear = new Date().getFullYear();
      document.getElementById('copyright-year').innerText = currentYear;
    });


    function displayGreeting() {
      var currentTime = new Date();
      var hours = currentTime.getHours();

      var greeting;

      if (hours < 12) {
        greeting = 'Good morning!';
      } else if (hours < 18) {
        greeting = 'Good afternoon!';
      } else {
        greeting = 'Good evening!';
      }

      document.getElementById('greeting').innerHTML = greeting;
    }



    function showTab(tabIndex) {
      const tabHeaders = document.querySelectorAll('.tab-header');
      const tabContents = document.querySelectorAll('.tab-content');

      for (let i = 0; i < tabHeaders.length; i++) {
        tabHeaders[i].classList.remove('active');
        tabContents[i].classList.remove('active');
      }

      tabHeaders[tabIndex].classList.add('active');
      tabContents[tabIndex].classList.add('active');
    }
