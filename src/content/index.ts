import { PhysicsWorld } from './physics/PhysicsWorld';
import { MouseTracker } from './interaction/MouseTracker';
import { ScrollTracker } from './interaction/ScrollTracker';
import { ElementScanner } from './scanner/elementScanner';
import { TransformRenderer } from './renderer/TransformRenderer';
import { SpringBody } from './physics/SpringBody';
import { getSettings, onSettingsChange, BounceSettings, defaultSettings } from '../shared/settings';

class Bounce_Engine {
  private world: PhysicsWorld;
  private mouseTracker: MouseTracker;
  private scrollTracker: ScrollTracker;
  private scanner: ElementScanner;
  private renderer: TransformRenderer;
  private settings: BounceSettings = defaultSettings;
  
  private isRunning = false;

  constructor() {
    this.world = new PhysicsWorld();
    this.mouseTracker = new MouseTracker();
    this.scrollTracker = new ScrollTracker();
    this.renderer = new TransformRenderer();
    
    this.scanner = new ElementScanner(
      (body: SpringBody) => {
        this.world.addBody(body);
      },
      (element: HTMLElement) => {
        this.world.bodies = this.world.bodies.filter(b => b.element !== element);
        element.style.transform = '';
      }
    );

    getSettings().then(s => {
      this.settings = s;
    });

    onSettingsChange(s => {
      this.settings = s;
      if (!s.enabled) {
        this.world.bodies.forEach(b => b.element.style.transform = '');
      }
    });
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    this.scanner.scan();
    
    requestAnimationFrame(this.loop.bind(this));
  }



  private loop(currentTime: number) {
    if (!this.isRunning) return;
    
    this.mouseTracker.update(currentTime);
    this.scrollTracker.update(currentTime);

    this.world.step(
      currentTime, 
      this.mouseTracker.velocity, 
      this.mouseTracker.position,
      this.scrollTracker.velocity,
      this.settings
    );
    
    if (this.settings.enabled) {
      this.renderer.render(this.world.bodies);
    }
    
    requestAnimationFrame(this.loop.bind(this));
  }
}

const engine = new Bounce_Engine();
engine.start();

