const leftPath = "M133.261 224.86C172.766 223.344 98.9547 262.743 100.459 301.946C101.963 341.149 71.1577 374.158 31.6528 375.674C-7.85214 377.19 69.8686 342.381 68.3643 303.178C66.86 263.974 93.7558 226.376 133.261 224.86Z";
const rightPath = "M72.1393 272.911C72.4325 233.378 108.413 308.914 147.644 309.205C186.874 309.496 218.44 341.78 218.146 381.313C217.853 420.846 186.636 341.614 147.405 341.323C108.175 341.032 71.8461 312.444 72.1393 272.911Z";
let toggle = false;

function animateLogo()
    {
    if (toggle){
        const timeline = anime.timeline({duration : 1000,easing : 'easeOutQuad'});
        timeline.add({targets: ".Tail",d: [{value: rightPath}]});
        toggle = false;
    }
    else {
        const timeline = anime.timeline({duration : 1000,easing : 'easeOutQuad'});
        timeline.add({targets: ".Tail",d: [{value: leftPath}]})
        .add({targets: ["#rightEye","#leftEye"], fill: [{value: "#1B1718"}]},"-=850")
        .add({targets: ["#rightEye","#leftEye"], fill: [{value: "#fffff"}]},"-=850");
        toggle = true;
    }
    setTimeout(() => { animateLogo(); }, Math.floor(Math.random() * 15000) + 1);
    }
animateLogo();