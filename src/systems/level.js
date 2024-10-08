/**
 * System overseeing the game.
 * 
 * Events:
 * - 'level-loaded' emitted on the scene after current active level changed
 */
AFRAME.registerSystem('level', {
  init: function() {
    this.hands = document.querySelectorAll('[gesture-tracker]');

    const sceneEl = this.el;
    sceneEl.addEventListener('loadlevel', (e) => this.loadLevel(e.detail.levelId));

    // the true "main()"
    sceneEl.addEventListener('loaded', (e) => {
      // jump straight to a particular level if indicated by a URL param
      const levelId = new URLSearchParams(location.search).get('levelId') || '#title';

      this.loadLevel(levelId);
  
      // DEBUG.loadLevel('#level_7', 0)
      // DEBUG.grabPortal('#right', '#title', 10000);
      // DEBUG.grabGun('#left', '#level_1', 500);
      // DEBUG.move('#left', '-1 1.5 -0.5', 550);
      // DEBUG.shoot('#left', 600);
      // DEBUG.move('#left', '0 1.5 -0.5', 750);
      // DEBUG.punch('#left', 1000);
      // DEBUG.drop('#left', 1500);
      // DEBUG.grabPortal('#right', '#level_1', 2000);

      // DEBUG.log('foo')
    })
  },
  loadLevel: function(levelId) {
    let activeLevel = this.activeLevel;

    if (activeLevel && '#'+activeLevel.id === levelId) {
      location.search = '?levelId=' + levelId
      return;
    }

    if (activeLevel) {
      this.toggleLevel(activeLevel, false)
    }

    activeLevel = document.querySelector(levelId)
    this.toggleLevel(activeLevel, true)
    this.activeLevel = activeLevel;

    // make hand controllers' release their grabbed objects
    this.hands.forEach(hand => { hand.components['gesture-tracker']?.reset() })
    // remove all objects moved by the puppeteer in this level
    this.el.systems.puppeteer.reset();

    this.el.emit('level-loaded', { level: activeLevel });
  },
  toggleLevel: function(levelEl, active) {
    levelEl.setAttribute('level', { active });
    const sceneEl = this.el;
    sceneEl[active ? 'addState' : 'removeState'](levelEl.id);
    sceneEl[levelEl.getAttribute('level').gameTimeTracked ? 'addState' : 'removeState']('game-time-tracked');
    sceneEl.removeState('level-cleared');
    sceneEl.removeState('game-over')
    sceneEl.systems.puppeteer.stopSpeak();
  }
});