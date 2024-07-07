$(document).ready(function(){
  $('.bf-testimonial-slick').slick({
		pauseOnHover: true,
		autoplay: false,
		autoplayspeed: 2000,
		speed: 1000,
		centerMode: true,
		centerPadding: '20%',
		slidesToShow: 2,
		slidesToScroll: 1,
		arrows: true,
		dots: true,
		draggable:true,
		responsive: [{
			breakpoint: 991,
			settings: {
				slidesToShow: 1,
			}
		}]

  });
});
