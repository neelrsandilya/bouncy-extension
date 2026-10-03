import { SpringBody } from '../physics/SpringBody';
import { VALID_SELECTORS, isBlacklisted } from './selectors';

export class ElementScanner {
  private observer: IntersectionObserver;
  private mutationObserver: MutationObserver;
  private onElementFound: (body: SpringBody) => void;
  private onElementLost: (element: HTMLElement) => void;
  private scannedElements = new WeakSet<HTMLElement>();

  constructor(
    onElementFound: (body: SpringBody) => void,
    onElementLost: (element: HTMLElement) => void
  ) {
    this.onElementFound = onElementFound;
    this.onElementLost = onElementLost;

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      root: null,
      rootMargin: '100px',
      threshold: 0
    });

    this.mutationObserver = new MutationObserver(this.handleMutations.bind(this));
  }
//observing via intersection observer and adding to the set
  public scan() {
    this.scanNode(document.body);
    
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private scanNode(root: HTMLElement) {
    if (!root || !root.querySelectorAll) return;
    
    try {
      const elements = root.querySelectorAll<HTMLElement>(VALID_SELECTORS);
      elements.forEach(el => this.observeElement(el));
      
      if (root.matches && root.matches(VALID_SELECTORS)) {
        this.observeElement(root);
      }
    } catch (e) {
    }
  }

  private observeElement(el: HTMLElement) {
    if (this.scannedElements.has(el)) return;
    if (isBlacklisted(el)) return;
    
    this.scannedElements.add(el);
    this.observer.observe(el);
  }
// for SPAs to adjust as new elements get added/removed to the webpage
  private handleMutations(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.scanNode(node as HTMLElement);
          }
        });
      }
    }
  }


  private handleIntersection(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {

      const el = entry.target as HTMLElement;
      // when visible on screen
      if (entry.isIntersecting) {

        const rect = entry.boundingClientRect;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // we ignore bigger comtainers to keep site usable , u can remove this below code and try it around
        if (rect.width > vw * 0.6 || rect.height > vh * 0.6) {
          continue;
        }

        const body = new SpringBody(el);
        //caching positions to avoid recalculating and saving memory
        body.cachedPageX = rect.left + window.scrollX + rect.width / 2;
        body.cachedPageY = rect.top + window.scrollY + rect.height / 2;
        


        const style = window.getComputedStyle(el);
        const transform = style.transform;
        if (transform !== 'none') {
          body.initialTransform = transform;
        }

        //setting some specific & general initializations for the body properties
        const tag = el.tagName.toLowerCase();
        if (tag === 'img' || tag === 'ytd-thumbnail' || tag === 'video' || tag === 'iframe') {
          body.mass = 2.0;
          body.stiffness = 120;
          body.damping = 12;
        } else if (tag === 'button' || tag === 'a' || el.getAttribute('role') === 'button') {
          body.mass = 0.8;
          body.stiffness = 220;
          body.damping = 18;
        } else {


          body.mass = 4.0;
          body.stiffness = 100;
          body.damping = 14;
        }

        //attching event listeners
        const downHandler = () => { 
          body.isPressed = true; 
          body.wakeUp();
        };
        const upHandler = () => { 
          body.isPressed = false; 
          body.wakeUp();
        };
        const enterHandler = () => {
          body.wakeUp();
        };
        
        el.addEventListener('mousedown', downHandler);
        el.addEventListener('mouseup', upHandler);
        el.addEventListener('mouseenter', enterHandler);
        el.addEventListener('mouseleave', upHandler);
        el.addEventListener('touchstart', downHandler, { passive: true });
        el.addEventListener('touchend', upHandler, { passive: true });
        el.addEventListener('touchcancel', upHandler, { passive: true });

        //adding special property so that the body remembers the handlers to detach them later
        (el as any).__jiggleHandlers = { downHandler, upHandler, enterHandler };



        this.onElementFound(body);
        
      } else {
        //when scrolled away from screen, removing all listeners
        const handlers = (el as any).__jiggleHandlers;
        if (handlers) {
          el.removeEventListener('mousedown', handlers.downHandler);
          el.removeEventListener('mouseup', handlers.upHandler);
          el.removeEventListener('mouseenter', handlers.enterHandler);
          el.removeEventListener('mouseleave', handlers.upHandler);
          el.removeEventListener('touchstart', handlers.downHandler);
          el.removeEventListener('touchend', handlers.upHandler);
          el.removeEventListener('touchcancel', handlers.upHandler);
          delete (el as any).__jiggleHandlers;
        }
        this.onElementLost(el);
      }
    }
  }
}
