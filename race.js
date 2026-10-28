let runners;
let portrait = window.innerHeight > window.innerWidth;

if (portrait) document.body.style.height = window.innerHeight + 'px';

function newrunners(a) {
	runners = '';
	if (a === 'abc') runners = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
	else if (a === 'periodic') runners = 'h,he,li,be,b,c,n,o,f,ne,na,mg,al,si,p,s,cl,ar,k,ca,sc,ti,v,cr,mn,fe,co,ni,cu,zn,ga,ge,as,se,br,kr,rb,sr,y,zr,nb,mo,tc,ru,rh,pd,ag,cd,in,sn,sb,te,i,xe,cs,ba,la,ce,pr,nd,pm,sm,eu,gd,tb,dy,ho,er,tm,yb,lu,hf,ta,w,re,os,ir,pt,au,hg,tl,pb,bi,po,at,rn,fr,ra,ac,th,pa,u,np,pu,am,cm,bk,cf,es,fm,md,no,lr,rf,db,sg,bh,hs,mt,ds,rg,cn,nh,fl,mc,lv,ts,og';
	else if (/ci[_ab]*$/gm.test(a)) {
		const ci_a = 'hc,mf,mq,pl,so,tw,ht,ab';
		const ci_b = 'ar,dd,ek,eo,fg,ho,rt,sm,sh';
		const ci_c = 'on,rd';
		runners = (a === 'ci_a' ? ci_a : a === 'ci_b' ? ci_b : ci_a + ',' + ci_b) + ',' + ci_c;
	}
	else if (a.match(/^[0-9]+$/g)) {
		let t = a <= 1 ? 2 : parseInt(a);
		for (let i = 1; i <= t; i++) {
			runners += i + ',';
		}
	}
	else runners = a;
	localStorage.runners = runners;
	if (window.location.hash) window.location.hash = '';
	if (window.location.search) window.location.search = '';
	window.location.href = window.location.origin + '/race';
}

if (window.location.hash && window.location.hash !== '#') newrunners(window.location.hash.substring(1));
else if (window.location.search && window.location.search !== '?') newrunners(window.location.search.substring(1));
else if (localStorage.runners) runners = localStorage.runners;
else {
	let input = window.prompt('Enter a comma-delimited list of runners\' initials');
	if (input !== null) newrunners(input);
}

let field = document.querySelector('.s1 ul');
let ap = 'abcdefghijklmnop'.split('');

let i = 0;
runners = runners.split(',').filter(Boolean).sort().sort((a, b) => a - b); // Double sort to arrange alphabetically then numerically
runners = [...(new Set(runners))];
localStorage.runners = runners.toString();
const runner_size = () => {
	field.style.fontSize = portrait ? 'calc(1rem / ' + (runners.length * 2) + ')' : 'calc(0.99rem / ' + runners.length + ')';
};
runner_size();
runners.forEach(r => {
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

circles.forEach(c => {
	c.addEventListener('click', () => update(c));
	c.addEventListener('mouseenter', e => {
		if (e.buttons) update(c);
	});
});

if (localStorage.option) {
	const active_option = document.querySelector('footer .active');
	active_option.classList.remove('active');
	[...active_option.parentNode.children][Number(localStorage.option)].classList.add('active');
}

options.forEach(o => {
	o.addEventListener('click', () => {
		document.querySelector('footer .active').classList.remove('active');
		o.classList.add('active');
		
		const active_option = document.querySelector('footer .active');
		localStorage.option = [...active_option.parentNode.children].indexOf(active_option);
	});
});

function edit() {
	let newinput = window.prompt('Enter a comma-delimitted list of runners\' initials', localStorage.runners);
	if (newinput != null && newinput !== localStorage.runners) newrunners(newinput);
}

function go() {
    if (field.querySelectorAll('.disabled').length + 1 >= runners.length) {
        window.alert('Please unbench at least two racers');
        return;
    }

    document.body.classList.add('underway');
    let startTime = performance.now();

    // Get all active runners and assign them random durations
    let activeRunners = Array.from(circles).filter(c => !c.classList.contains('disabled'));
    
    activeRunners.forEach(c => {
        const duration = Math.random() * 10 + 5; // 5 to 15 seconds
        const bezier = Array.from({ length: 4 }, () => Math.random().toFixed(2)).join(',');
        
        c.style.transitionTimingFunction = `cubic-bezier(${bezier})`;
        c.style.transitionDuration = `${duration}s`;
        
        // Trigger the movement class or style update
        // (Assuming a class or transform moves them to the end)
    });

    // Listen for who finishes first naturally using the native transitionend event
    activeRunners.forEach(c => {
        c.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'transform' || e.propertyName === 'left') {
                if (!c.classList.contains('finished')) {
                    c.classList.add('finished');
                    let elapsedTime = ((performance.now() - startTime) / 1000).toFixed(1);
                    
                    results.querySelector('div').insertAdjacentHTML(
                        'beforeend', 
                        `<p>${c.innerText}<span>${elapsedTime}s</span></p>`
                    );

                    // Check if all active runners have finished
                    if (document.querySelectorAll('.s1 span:not(.disabled).finished').length === activeRunners.length) {
                        results.classList.add(document.querySelector('footer .active').innerText.toLowerCase());
                    }
                }
                c.removeEventListener('transitionend', handler);
            }
        });
    });
}

editbutton.addEventListener('click', () => edit());
gobutton.addEventListener('click', () => go());
window.addEventListener('keypress', e => {
	if ((e.which || e.keyCode) == 13 || (e.which || e.keyCode) == 32) {
		e.preventDefault();
		if (document.body.className === 'underway') window.location.reload();
		else go();
	}
});

let resize_timeout;
window.addEventListener('resize', () => {
	clearTimeout(resize_timeout);
	resize_timeout = setTimeout(() => {
		document.body.style.height = window.innerHeight + 'px';
		runner_size();
	}, 500);
});
