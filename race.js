if (window.innerHeight > window.innerWidth) document.body.style.height = window.innerHeight + 'px';

let runners;

function newrunners(a) {
	runners = '';
	if (a.match(/^[0-9]+$/g)) {
		let t = parseInt(a);
		for (let i = 1; i <= t; i++) {
			runners += i + ',';
		}
	} else {
		if (a === 'abc') runners = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
		else if (a === 'periodic') runners = 'h,he,li,be,b,c,n,o,f,ne,na,mg,al,si,p,s,cl,ar,k,ca,sc,ti,v,cr,mn,fe,co,ni,cu,zn,ga,ge,as,se,br,kr,rb,sr,y,zr,nb,mo,tc,ru,rh,pd,ag,cd,in,sn,sb,te,i,xe,cs,ba,la,ce,pr,nd,pm,sm,eu,gd,tb,dy,ho,er,tm,yb,lu,hf,ta,w,re,os,ir,pt,au,hg,tl,pb,bi,po,at,rn,fr,ra,ac,th,pa,u,np,pu,am,cm,bk,cf,es,fm,md,no,lr,rf,db,sg,bh,hs,mt,ds,rg,cn,nh,fl,mc,lv,ts,og';
		else if (a === 'ci') runners = 'ac,ba,da,dl,li,mo,mt,on,pw,rd,rs,sp,vz';
		else runners = a;
	}
	localStorage.runners = runners.replace(/^\,|\,$/gm, '').replace(/\,\,+/gm, ',');
	window.location.reload();
}

if (window.location.href.indexOf('?') > -1 && window.location.href.indexOf(',') > -1) {
	localStorage.runners = window.location.href.replace(/.*?\?/gm, '');
	setTimeout(() => window.location.href = window.location.href.replace(/\?.*?$/gm, ''), 100);
} else if (localStorage.runners) runners = localStorage.runners;
else {
	let input = window.prompt('Enter a comma-delimitted list of runners\' initials');
	if (input !== null) newrunners(input);
}

let field = document.querySelector('.s1 ul');
let ap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

let i = 0;
runners = runners.split(',').filter(Boolean).sort().sort((a, b) => a - b);
runners = [...(new Set(runners))];
localStorage.runners = runners.toString();
field.style.fontSize = 'calc(1rem / ' + runners.length + ')';
runners.forEach((r) => {
	var ii;
	if (i >= ap.length) i = 0;
	ii = i++;
	field.insertAdjacentHTML('beforeend', '<li><span class="' + ap[ii] + '" title="Bench me">' + r + '</span></li>');
});

let circles = document.querySelectorAll('.s1 span');
let results = document.querySelector('.s2');
let options = document.querySelectorAll('footer span');
let editbutton = document.querySelector('.edit');
let gobutton = document.querySelector('.go');

function update(a) {
	a.classList.toggle('disabled');
	a.title = a.classList.contains('disabled') ? 'Put me back in' : 'Bench me';
}

circles.forEach((c) => {
	c.addEventListener('click', () => update(c));
	c.addEventListener('mouseenter', (e) => {
		if (e.buttons) update(c);
	});
});

options.forEach((o) => {
	o.addEventListener('click', () => {
		document.querySelector('footer .active').classList.remove('active');
		o.classList.add('active');
	});
});
function edit() {
	let newinput = window.prompt('Enter a comma-delimitted list of runners\' initials', localStorage.runners);
	if (newinput != null && newinput !== localStorage.runners) newrunners(newinput);
}
function go() {
	let t = 0;
	let si1 = setInterval(() => t++, 100);
	document.body.classList.add('underway');
	circles.forEach((c) => {
		if (!c.classList.contains('disabled')) {
			let d;
			let e = Math.random().toFixed(2) + ',' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2);
			if (window.location.hash.includes(c.innerText.toLowerCase())) d = (Math.random() * (25 - 20) + 20).toFixed(1); 
			else d = (Math.random() * (30 - 10) + 10).toFixed(1);
			c.style.transitionTimingFunction = 'cubic-bezier(' + e + ')';
			c.style.transitionDuration = d + 's';
			let si2 = setInterval(() => {
				if (document.querySelectorAll('.finished').length === document.querySelectorAll('.s1 span:not(.disabled)').length) {
					clearInterval(si1);
					clearInterval(si2);
					results.classList.add(document.querySelector('footer .active').innerText.toLowerCase());
				} else if (c.offsetLeft + c.clientWidth >= field.clientWidth - 2) {
					if (!c.classList.contains('finished')) {
						c.classList.add('finished');
						if (results.innerText.indexOf(t / 10) > -1) t++;
						results.querySelector('div').insertAdjacentHTML('beforeend', '<p>' + c.innerText + '<span>' + (t / 10) + 's</span></p>');
					}
				}
			}, 100);
		}
	});
}
editbutton.addEventListener('click', () => edit());
gobutton.addEventListener('click', () => go());
window.addEventListener('keypress', (e) => {
	if ((e.which || e.keyCode) == 13 || (e.which || e.keyCode) == 32) {
		e.preventDefault();
		if (document.body.className === 'underway') window.location.reload();
		else go();
	}
});
window.addEventListener('resize', () => document.body.style.height = window.innerHeight + 'px');
