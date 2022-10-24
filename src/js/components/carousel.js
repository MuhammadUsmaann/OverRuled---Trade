"use strict";

class Carousel {
    #carouselElement = null;
    #autoSlideInterval = null;
    #carouselObj = null;
    #slides = null;
    #controls = null;
    #timer = null;
    

    constructor(carouselElement, autoSlideInterval) {
        this.#carouselElement = carouselElement;
        this.#autoSlideInterval = autoSlideInterval;

        this.#carouselObj = $(carouselElement);
        this.#slides = this.#carouselObj.find(".tb-carousel-item");
        var nextButton = this.#carouselObj.parent().find("[data-role=next-button]");

        var x = 1;

        this.#controls = $(".tb-carousel-controls[data-target=" + this.#carouselObj.attr("id") + "]");
        var timer;

        this.#carouselObj.data("next-slide", 1);

        
        this.#controls.children(".tb-carousel-control").on("click", function (e) {
            if (timer) {
                clearTimeout(timer);
            }
            goToCarouselSlide( $(this).data("slide-to"));

            if (autoSlideInterval) {
                //reset the timer
                sender.#timer = sender.#initializeCarouselTimer();
            }

        });

        if (nextButton) {

            nextButton.on("click", function (e) {
                e.preventDefault();
                if (timer) {
                    clearTimeout(sender.#timer);
                }

                goToCarouselSlide(sender.#carouselObj.data("next-slide"));
                if (sender.#autoSlideInterval) {
                    //reset the timer
                    sender.#timer = this.#initializeCarouselTimer();
                }
            });
        }
        if (this.#autoSlideInterval) {
            this.#timer = this.#initializeCarouselTimer();
        }

    };

    #initializeCarouselTimer() {
        var sender = this;
        var timer = setInterval(function () {
            sender.#goToCarouselSlide(sender.#carouselObj.data("next-slide"));

        }, sender.#autoSlideInterval);

        return timer;
    };

    #goToCarouselSlide(targetSlideNum) {
        this.#slides.removeClass("active");
        $(this.#slides[targetSlideNum]).addClass("active");

        var navButtons = this.#controls.children(".tb-carousel-control");
        navButtons.removeClass("active");
        $(navButtons[targetSlideNum]).addClass("active");

        var next = targetSlideNum + 1;
        if (next > (this.#slides.length - 1)) {
            next = 0;
        }
        this.#carouselObj.data("next-slide", next);
    }
}

export default Carousel