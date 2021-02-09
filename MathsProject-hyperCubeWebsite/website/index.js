const COPYRIGHT_DATE = $("#copyright-date");
COPYRIGHT_DATE.text(new Date().getFullYear());

const INTRO = $("#intro-section");
const PARTICLES = $("#particles-js");
PARTICLES.height(INTRO.height());
PARTICLES.width(INTRO.width());

/* ---- particles.js config ---- */

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 200,
            "density": {
                "enable": true,
                "value_area": 500
            }
        },
        "color": {
            "value": "#c3ffa3"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
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
            "color": "#e3fad7",
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