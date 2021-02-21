
// Resize the Buy me a coffee button if width gets too small ON START
if (window.screen.availWidth < 417) {
    document.getElementById("coffeeLink").src = "https://img.buymeacoffee.com/button-api/?text= &emoji=&slug=HypercubeSite&button_colour=c4ffe2&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=FFDD00";
} else {
    document.getElementById("coffeeLink").src = "https://img.buymeacoffee.com/button-api/?text=Buy us a coffee&emoji=&slug=HypercubeSite&button_colour=c4ffe2&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=FFDD00";
}

const COPYRIGHT_DATE = $("#copyright-date");
COPYRIGHT_DATE.text(new Date().getFullYear());
