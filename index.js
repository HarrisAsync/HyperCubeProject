const INTRO = $("#intro-section");
const TITLE = $("#title");
const PARTICLE = $("#particles-js");

/* ---- particles.js config ---- */
function resize() {
    PARTICLE.width(TITLE.outerWidth(false));
    PARTICLE.height(TITLE.outerHeight(true));
}

$(document).ready(function () {
    resize();

    runParticleJS();
});

window.onresize = function () {
    resize();

    runParticleJS();
};


function runParticleJS() {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 2,
                "density": {
                    "enable": true,
                    "value_area": 10
                }
            },
            "color": {
                "value": "#1C5E3E"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#1C5E3E"
                },
                "polygon": {
                    "nb_sides": 5
                },
            },
            "opacity": {
                "value": 0.75,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 120,
                "color": "#1C5E3E",
                "opacity": 0.75,
                "width": 2
            },
            "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "retina_detect": true
    });
}

/* ---- particles.js config ---- */



