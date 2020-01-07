if (window.innerHeight > window.innerWidth) document.body.style.height = window.innerHeight + "px";

let runners = [];
if (window.location.href.indexOf("#") > -1 && window.location.href.indexOf(",") > -1) {
	runners = window.location.href.replace(/.*?\#/gm, "");
	setTimeout(() => window.location.href = window.location.href.replace(/\#.*?$/gm, ""), 100);
} else if (localStorage.runners) runners = localStorage.runners;
else runners = window.prompt("Enter a comma-delimitted list of runners' initials");

if (runners) localStorage.runners = runners;
else window.location.reload();

let field = document.querySelector(".s1 ul");
let ap = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"];

let i = 0;
runners = runners.toUpperCase().split(",").sort().sort((a, b) => a - b);
runners.forEach((r) => {
	var ii;
	if (i >= ap.length - 1) i = 0;
	ii = i++;
	field.insertAdjacentHTML("beforeend", "<li><span class='" + ap[ii] + "' title='Bench me'>" + r + "</span></li>");
});

let circles = document.querySelectorAll(".s1 span");
let results = document.querySelector(".s2");
let options = document.querySelectorAll("footer span");
let button = document.querySelector("button");

circles.forEach((c) => {
	c.addEventListener("click", () => {
		c.classList.toggle("disabled");
		c.title = c.classList.contains("disabled") ? "Put me back in" : "Bench me";
	});
});

options.forEach((o) => {
	o.addEventListener("click", () => {
		document.querySelector("footer .active").classList.remove("active");
		o.classList.add("active");
	});
});

function go() {
	let t = 0;
	let si1 = setInterval(() => t++, 100);
	document.body.classList.add("underway");
	circles.forEach((c) => {
		if (!c.classList.contains("disabled")) {
			let e = Math.random().toFixed(2) + "," + Math.random().toFixed(2) + "," + Math.random().toFixed(2) + "," + Math.random().toFixed(2);
			c.style.transitionTimingFunction = "cubic-bezier(" + e + ")";
			c.style.transitionDuration = (Math.random() * (15 - 5) + 5).toFixed(1) + "s";
			let si2 = setInterval(() => {
				if (document.querySelectorAll(".finished").length === document.querySelectorAll(".s1 span:not(.disabled)").length) {
					clearInterval(si1);
					clearInterval(si2);
					results.classList.add(document.querySelector("footer .active").innerText.toLowerCase());
				} else if (c.offsetLeft + c.clientWidth >= field.clientWidth - 5) {
					if (!c.classList.contains("finished")) {
						c.classList.add("finished");
						if (results.innerText.indexOf(t / 10) > -1) t++;
						results.insertAdjacentHTML("beforeend", "<p>" + c.innerText + "<span>" + (t / 10) + "s</span></p>");
					}
				}
			}, 100);
		}
	});
}

button.addEventListener("click", () => go());
window.addEventListener("keypress", (e) => {
	if (e.which == 13 || e.keyCode == 13) go();
});
window.addEventListener("resize", () => document.body.style.height = window.innerHeight + "px");

