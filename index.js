const spies = document.querySelectorAll('[data-spy]');
const cls = 'active';
const ratio = .6;
let observer = null;

/**
 * 
 * @param {HTLMElement} elem 
 * @returns 
 */
const activeLink = (elem) => {
  const id = elem.getAttribute('id');
  const anchor = document.querySelector(`a[href="#${id}"]`);

  if(!anchor) return;

  const links = document.querySelectorAll(`li a.${cls}`);
  links.forEach(link => link.classList.remove(`${cls}`))
  anchor.classList.add(`${cls}`);
}

/**
 * @param {IntersectionObserverEntry[]} entries 
 * @param {IntersectionObserver} observer 
 */
const callback = entries =>{
  entries.forEach( ({isIntersecting, target}) => {
    isIntersecting ? activeLink(target) : null;
  });
}

/**
 * 
 * @param {NodelistOf.<Element>} elems 
 */
const observe = elems => {

  if(observer !== null) {
    elems.forEach(elem => observer.unobserve(elem));
  }

  const y = Math.round(window.innerHeight * ratio);
  observer = new IntersectionObserver(callback, {
    rootMargin: `-${window.innerHeight - y -1}px 0px -${y}px 0px`
  });

  elems.forEach( elem => observer.observe(elem));
}

/**
 * 
 * @param {function} callback 
 * @param {number} delay 
 * @returns {function}
 */
const debounce = (callback, delay) =>{
  let timer;
  return function(){
    let args = arguments;
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(function(){
        callback.apply(context, args);
    }, delay)
  }
}

if(spies.length > 0){
  observe(spies)

  let windowH = window.innerHeight;
  window.addEventListener('resize', debounce(()=> {
    if(window.innerHeight !== windowH){
      observe(spies)
      windowH = window.innerHeight;
    }
  }, 500))
}
