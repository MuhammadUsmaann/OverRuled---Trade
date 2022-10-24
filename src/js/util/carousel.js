

var initializeCarousel = function (carouselElement, autoSlideInterval) {
    var carousel = $(carouselElement);
    var items = carousel.find(".tb-carousel-item");
    var nextButton = carousel.parent().find("[data-role=next-button]");

    var numberOfItems = items.length;

    var controls = $(".tb-carousel-controls[data-target=" + carousel.attr("id") + "]");
    var timer;
    var nextSlide = 1;

    carousel.data("next-slide", 1);

    controls.children(".tb-carousel-control").on("click", function (e) {
        if (timer) {
            clearTimeout(timer);
        }
        goToCarouselSlide(carousel, items, controls, $(this).data("slide-to"));

        if (autoSlideInterval) {
            //reset the timer
            timer = initializeCarouselTimer(carousel, items, controls, autoSlideInterval);
        }

    });

    if (nextButton) {

        nextButton.on("click", function (e) {
            e.preventDefault();
            if (timer) {
                clearTimeout(timer);
            }

            goToCarouselSlide(carousel, items, controls, carousel.data("next-slide"));
            if (autoSlideInterval) {
                //reset the timer
                timer = initializeCarouselTimer(carousel, items, controls, autoSlideInterval);
            }
        });
    }
    if (autoSlideInterval) {
        timer = initializeCarouselTimer(carousel, items, controls, autoSlideInterval);
    }

};

function initializeCarouselTimer(carousel, slides, navcontrols, autoSlideInterval) {
    var timer = setInterval(function () {
        //console.log("Timed event");
        goToCarouselSlide(carousel, slides, navcontrols, carousel.data("next-slide"));

    }, autoSlideInterval);

    return timer;
}

function goToCarouselSlide(carousel, slides, navcontrols, gotoNum) {
    //console.log("Go To: " + gotoNum);
    slides.removeClass("active");
    $(slides[gotoNum]).addClass("active");

    var navButtons = navcontrols.children(".tb-carousel-control")
    navButtons.removeClass("active");
    $(navButtons[gotoNum]).addClass("active");

    var next = gotoNum + 1;
    if (next > (slides.length - 1)) {
        next = 0;
    }
    carousel.data("next-slide", next);
}



module.exports = {
    //loadHEAD: loadHEAD,
    initializeCarousel: initializeCarousel
};