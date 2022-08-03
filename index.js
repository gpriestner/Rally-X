console.log("working. . .");

class Direction {
  static North = 0;
  static East = 1;
  static South = 2;
  static West = 3;
}
class Snippet {
  constructor(fileName, size) {
    for (let i = 0; i < size; ++i) this.sound.push(Snippet.audio(fileName));
  }
  static sounds = [];
  static audio(src) {
    const a = new Audio(src);
    //a.volume = Sound.volume * (1 / Sound.maxVolume);
    Snippet.sounds.push(a);
    return a;
  }
  sound = [];
  count = 0;
  play() {
    this.sound[++this.count % this.sound.length].play();
  }
}
class Sound {
  // static batHit = new Snippet("./sounds/hit.mp3", 6);
  // static hit = Snippet.audio("./sounds/hit.mp3");
}
class GamePad {
  static isConnected = false;
  static current = null;
  static previous = null;
  static GamePad = (() => {
    addEventListener("gamepadconnected", (event) => {
      GamePad.current = navigator.getGamepads()[0];
      GamePad.previous = GamePad.current;
      GamePad.isConnected = true;
    });
    addEventListener("gamepaddisconnected", (event) => {
      GamePad.isConnected = false;
    });
  })();
  static update() {
    if (GamePad.isConnected) {
      GamePad.previous = GamePad.current;
      GamePad.current = navigator.getGamepads()[0];
    }
  }
  static isDown(button) {
    return GamePad.isConnected && GamePad.current.buttons[button].pressed;
  }
  static isPressed(button) {
    return (
      GamePad.isConnected &&
      GamePad.current.buttons[button].pressed &&
      !GamePad.previous.buttons[button].pressed
    );
  }
  static value(button) {
    if (!GamePad.isConnected) return 0;
    else return GamePad.current.buttons[button].value;
  }
  static get angle() {
    if (GamePad.isConnected) {
      const x = GamePad.current.axes[0];
      const y = GamePad.current.axes[1];
      if (!(x > -0.15 && x < 0.15 && y > -0.15 && y < 0.15)) {
        const ang = Math.atan2(y, x);
        return ang;
      }
    }
    return null;
  }
  static get dx() {
    if (GamePad.isConnected && Math.abs(GamePad.current.axes[0]) > 0.15)
      return GamePad.current.axes[0];
    return 0;
  }
  static get dy() {
    if (GamePad.isConnected && Math.abs(GamePad.current.axes[1]) > 0.15)
      return GamePad.current.axes[1];
    return 0;
  }
}
class KeyState {
  isPressed;
  isReleased;
  constructor(isPressed, isReleased) {
    this.isPressed = isPressed;
    this.isReleased = isReleased;
  }
}
class Keyboard {
  static Keyboard = (() => {
    addEventListener("keydown", Keyboard.keyDown);
    addEventListener("keyup", Keyboard.keyUp);
  })();
  static state = {};
  static keyDown(event) {
    const state = Keyboard.state[event.code];
    if (state === undefined)
      Keyboard.state[event.code] = new KeyState(true, true);
    else state.isPressed = true;
  }
  static keyUp(event) {
    const state = Keyboard.state[event.code];
    state.isPressed = false;
    state.isReleased = true;
  }
  static isDown(key) {
    // returns true while the key is in the down position
    const state = Keyboard.state[key];
    if (state === undefined) return false;
    else return state.isPressed;
  }
  static isPressed(key) {
    // returns true only once when first depressed
    // must be released and re-pressed before returning true again
    const state = Keyboard.state[key];
    if (state === undefined) return false;
    if (state.isPressed && state.isReleased) {
      state.isReleased = false;
      return true;
    } else return false;
  }
}
class GameInput {
  // Down(A) = 0, Right(B) = 1, Left(X) = 2, Up(Y) = 3, LeftBumper = 4, RightBumper = 5, LeftTrigger = 6, RightTrigger = 7, Restart = 8
  // Pause = 9, LeftJoyPressed = 10, RightJoyPressed = 11, UpJoyPad = 12, DownJoyPad = 13, LeftJoyPad = 14, RightJoyPad = 15
  static get isPanNorth() {
    return (Keyboard.isDown("ShiftLeft") && Keyboard.isDown("ArrowUp")) || GamePad.isDown(3 /* Up */);
  }
  static get isPanSouth() {
    return (Keyboard.isDown("ShiftLeft") && Keyboard.isDown("ArrowDown")) || GamePad.isDown(0 /* Down */);
  }
  static get isPanWest() {
    return (Keyboard.isDown("ShiftLeft") && Keyboard.isDown("ArrowLeft")) || GamePad.isDown(2 /* Left */);
  }
  static get isPanEast() {
    return (Keyboard.isDown("ShiftLeft") && Keyboard.isDown("ArrowRight")) || GamePad.isDown(1 /* Right */);
  }
  static get isMoveNorth() {
    return Keyboard.isDown("ArrowUp");
  }
  static get isMoveSouth() {
    return Keyboard.isDown("ArrowDown");
  }
  static get isMoveWest() {
    return Keyboard.isDown("ArrowLeft");
  }
  static get isMoveEast() {
    return Keyboard.isDown("ArrowRight");
  }
  static get isSmoke() {
    return Keyboard.isPressed("Space") || GamePad.isPressed(5);
  }
  static get isZoomIn() {
    return Keyboard.isDown("KeyA") || GamePad.isDown(12 /* UpJoyPad */);
  }
  static get isZoomOut() {
    return Keyboard.isDown("KeyZ") || GamePad.isDown(13 /* DownJoyPad */);
  }
  static get isCarScaleDown() {
    return GamePad.isDown(14 /* LeftJoyPad */);
  }
  static get isCarScaleUp() {
    return GamePad.isDown(15 /* RightJoyPad */);
  }
  static get isPaused() {
    return Keyboard.isPressed("KeyP") || GamePad.isPressed(9 /* Pause */);
  }
  static get isFrame() {
    return Keyboard.isPressed("KeyF");
  }
  static get isRestart() {
    return Keyboard.isPressed("KeyR") || GamePad.isPressed(8 /* Restart */);
  }
  static get angle() {
    return GamePad.angle;
  }
  static get Direction() {
    let x = 0, y = 0;
    if (Keyboard.isDown("ArrowUp")) x -= 1;
    if (Keyboard.isDown("ArrowDown")) x += 1;
    if (Keyboard.isDown("ArrowLeft")) y -= 1;
    if (Keyboard.isDown("ArrowRight")) y += 1;
    return { x, y };
  }
}
class Picture {
  static Load(fileName) {
    const i = new Image();
    i.src = fileName;
    return i;
  }
}
class Flag {
  constructor(gridX, gridY, sflag) {
    this.collected = false;
    this.x = 5 * 24 + gridX * 24 + 12;
    this.y = 4 * 24 + gridY * 24 + 12;
    this.sflag = sflag;
    if (sflag) this.image = Picture.Load("images/Sflagt.png");
    else this.image = Picture.Load("images/Flagt.png");
  }
  get GridPos() {
    // convert actual position into grid coords
    return {
      x: Math.floor((this.x - 120) / 24),
      y: Math.floor((this.y - 96) / 24),
    };
  }
  update(progress, counter) {
    if (counter === 1) {
      const dist =
        Math.abs(game.car.x - this.x) ** 2 + Math.abs(game.car.y - this.y) ** 2;
      if (dist < 100) {
        this.collected = true;
      }
    }
  }
  draw() {
    if (!this.collected) {
      const pos = Map.Convert(this.x, this.y);

      Game.View.save();

      Game.View.translate(pos.x, pos.y);

      Game.View.drawImage(
        this.image,
        0,
        0,
        24,
        24,
        -0.5 * Car.scale * pos.scale.x, // 0, // pos.x,
        -0.5 * Car.scale * pos.scale.y, // -10, // pos.y,
        Car.scale * pos.scale.x,
        Car.scale * pos.scale.y
      );

      Game.View.restore();
    }
  }
}
class Flags {
  constructor() {
    this.flags = [];

    for (let i = 0; i < 10; ++i) {
      const pos = this.randomCell;
      this.flags.push(new Flag(pos.x, pos.y, i === 0 ? true : false));
    }
  }
  get Collected() {
    let count = 0;
    for (f of this.flags) if (f.collected) count += 1;
    return count;
  }
  get randomCell() {
    while (true) {
      const x = Math.floor(Math.random() * 32);
      const y = Math.floor(Math.random() * 56);
      if (Map.getPosition(x, y) === 0) return { x, y };
    }
  }
  update(progress, counter) {
    for (const flag of this.flags) flag.update(progress, counter);
  }
  draw() {
    for (const flag of this.flags) flag.draw();
  }
}
class Smoke {
  constructor(pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.ttl = 159;
    this.angle = 0;
    this.image = Picture.Load("images/smoket.png");
    if (Math.random() > 0.5) this.delta = 0.1;
    else this.delta = -0.1;
  }
  update(progesss, counter) {
    if (counter === 1 && this.ttl > 0) {
      this.ttl -= 1;

      for (const chaser of game.chasers.chasers) {
        const dist =
          Math.abs(chaser.x - this.x) ** 2 + Math.abs(chaser.y - this.y) ** 2;
        if (dist < 100) {
          chaser.crash = this.ttl;
        }
      }
    }
  }
  draw() {
    if (this.ttl > 0) {
      const pos = Map.Convert(this.x, this.y);

      Game.View.save();

      Game.View.translate(pos.x, pos.y);

      let shrinkFactor = 1;
      if (this.ttl < 50) {
        shrinkFactor = this.ttl / 50;
        Game.View.globalAlpha = shrinkFactor;

        this.angle += this.delta;
        Game.View.rotate(this.angle);
      }

      Game.View.drawImage(
        this.image,
        0,
        0,
        24,
        24,
        -0.5 * Car.scale * pos.scale.x,
        -0.5 * Car.scale * pos.scale.y,
        Car.scale * pos.scale.x * shrinkFactor,
        Car.scale * pos.scale.y * shrinkFactor
      );

      Game.View.restore();
    }
  }
}
class Smokes {
  constructor() {
    this.smokes = [];
  }
  update(progress, counter) {
    for (const smoke of this.smokes) smoke.update(progress, counter);

    if (counter === 1 && GameInput.isSmoke)
      this.smokes.push(new Smoke(game.car.Pos));
  }
  draw() {
    for (const smoke of this.smokes) smoke.draw();
  }
}
class Car {
  //  image = Car.Picture("images/bluecar24t2.png");
  image = Picture.Load("images/bluecar24t2.png");
  static scale = 24;
  constructor() {
    //this.x = 504 + 12;
    //this.y = 768 + 12;
    this.x = 5 * 24 + 15 * 24 + 12;
    this.y = 4 * 24 + 50 * 24 + 12;
    this.angle = 0;
    this.carScale = 24;
    this.speed = 0;
  }
  get Pos() {
    return { x: this.x, y: this.y };
  }
  get Top() {
    return this.y;
  }
  get Left() {
    return this.x;
  }
  get Right() {
    return this.x + this.carScale; // Game.ScaleX * (1008 / Map.SourceWidth);
  }
  get Bottom() {
    return this.y + this.carScale;
  }
  get CellX() {
    return Math.floor((this.x - 120) / 24);
  }
  get CellY() {
    return Math.floor((this.y - 96) / 24);
  }
  get GridPos() {
    // convert actual position into grid coords
    return {
      x: Math.floor((this.x - 120) / 24),
      y: Math.floor((this.y - 96) / 24),
    };
  }
  getPosition(x, y) {
    const gridX = Math.floor((x - 120) / 24);
    const gridY = Math.floor((y - 96) / 24);
    return Map.getPosition(gridX, gridY);
  }
  update(progress, counter) {
    // this.speed = GamePad.dx ** 2 + GamePad.dy ** 2;

    const angle = GameInput.angle;
    if (angle) {
      const x = this.x + GamePad.dx * 0.5;
      const y = this.y + GamePad.dy * 0.5;
      if (this.getPosition(x, y) == 0) {
        Map.X += x - this.x;
        Map.Y += y - this.y;
        this.x = x;
        this.y = y;
      }
    }

    if (GameInput.isCarScaleDown && Car.scale > 0.11) Car.scale -= 0.1;
    if (GameInput.isCarScaleUp && Car.scale < 50.01) Car.scale += 0.1;
  }
  draw() {
    const pos = Map.Convert(this.x, this.y);
    //Game.View.fillRect(pos.x, pos.y, 16, 16);
    //Game.View.strokeStyle = oldStyle;

    const angle = GameInput.angle;

    if (angle) this.angle = angle + Math.PI * 0.5;

    Game.View.save();

    Game.View.translate(pos.x, pos.y);
    // Game.View.fillText(`X:${this.CellX}  Y:${this.CellY}`, -20, -20);
    Game.View.rotate(this.angle);

    Game.View.drawImage(
      this.image,
      0,
      0,
      24,
      24,
      -0.5 * Car.scale * pos.scale.x, // previous translate means centre
      -0.5 * Car.scale * pos.scale.y, // of this image is at 0,0
      Car.scale * pos.scale.x,
      Car.scale * pos.scale.y
    );

    Game.View.restore();

    // Game.View.strokeRect(
    //   pos.x - this.carScale * pos.scale.x * 0.5,
    //   pos.y - this.carScale * pos.scale.y * 0.5,
    //   this.carScale * pos.scale.x,
    //   this.carScale * pos.scale.y
    // );
  }
}
class Chaser {
  static count = 0;
  image = Picture.Load("images/redcar24t2.png");
  constructor(pos) {
    this.x = 5 * 24 + pos.x * 24 + 12; // = 504 + 12;   pixel x position
    this.y = 4 * 24 + pos.y * 24 + 12; // 868 + 12;     pixel y position
    this.pos = pos; //                         grid cell x,y position
    this.angle = 0;
    this.carScale = 24;
    this.speed = 1;
    // this.direction = 0; // 0=north, 1=east, 2=south, 3=west
    this.dir = { x: 0, y: -1 };
    this.rotate = 0; // +1 = clockwise, -1 = anti-clockwise
    this.crash = 0;
    this.id = ++Chaser.count;
  }
  getPosition(x, y) {
    const gridX = Math.floor((x - 120) / 24);
    const gridY = Math.floor((y - 96) / 24);
    return Map.getPosition(gridX, gridY);
  }
  get GridPos() {
    // convert actual position into grid coords
    return {
      x: Math.floor((this.x - 120) / 24),
      y: Math.floor((this.y - 96) / 24),
    };
  }
  get isMidCell() {
    // is the current actual x,y position in the exact pixel centre of cell
    return (
      this.x % 12 === 0 &&
      this.x % 24 !== 0 &&
      this.y % 12 === 0 &&
      this.y % 24 !== 0
    );
  }
  get centrePoint() {
    // return the centre x,y pos of current grid location
    const pos = this.GridPos;
    return { x: pos.x * 24 + 12 + 120, y: pos.y * 24 + 12 + 96 };
  }
  get isEnterCell() {
    if (this.dir.y === -1) {
      // going north
      return this.y % 24 === 23;
    } else if (this.dir.y == 1) {
      // going south
      return this.y % 24 === 0;
    } else if (this.dir.x === 1) {
      // going east
      return this.x % 24 === 0;
    } else {
      // going west
      return this.x % 24 === 23;
    }
  }
  get isGoingNorth() {
    return this.dir.y === -1;
  }
  get isGoingSouth() {
    return this.dir.y === 1;
  }
  get isGoingEast() {
    return this.dir.x === 1;
  }
  get isGoingWest() {
    return this.dir.x === -1;
  }
  get isGoingNS() {
    return this.dir.x === 0;
  }
  get isGoingEW() {
    return this.dir.y === 0;
  }
  gridOption(dir, gridPos, carGridPos) {
    const dist =
      (gridPos.x - carGridPos.x) ** 2 + (gridPos.y - carGridPos.y) ** 2;

    const option = { dir, dist };
    return option;
  }
  isFree(dir) {
    // const content = Map.getPosition(this.pos.x + dir.x, this.pos.y + dir.y) === 0;

    const pos = { x: this.pos.x + dir.x, y: this.pos.y + dir.y };

    for (const chaser of game.chasers.chasers)
      if (pos.x === chaser.pos.x && pos.y === chaser.pos.y) {
        if (chaser.crash > 0) this.crash = 0;
        else this.crash = 50;
        return false;
      }
    return Map.getPosition(pos.x, pos.y) === 0;
  }
  isReverse = (dir) => this.dir.x === -dir.x && this.dir.y === -dir.y;
  get reverseDirection() {
    return { x: -this.dir.x, y: -this.dir.y };
  }
  reverse() {
    this.dir = this.reverseDirection;
    this.x += this.dir.x;
    this.y += this.dir.y;
    this.pos = this.GridPos;
    this.rotate = 2;
  }
  get directions() {
    // get all the possible directions to travel from current position (ignore reverse)
    const directions = [];
    const compass = [
      { x: 0, y: -1 }, // north
      { x: 0, y: 1 }, // east
      { x: -1, y: 0 }, // south
      { x: 1, y: 0 }, // west
    ];

    for (const d of compass)
      if (!this.isReverse(d) && this.isFree(d)) directions.push(d);

    // if there are no options this is a dead end so reverse must be used
    if (directions.length === 0)
      directions.push({ x: -this.dir.x, y: -this.dir.y });

    return directions;
  }
  rotation(d1, d2) {
    // is straight ahead?
    if (d1.x === d2.x && d1.y === d2.y) return 0;
    // is reverse?
    else if (d1.x === -d2.x && d1.y === -d2.y)
      return Math.random() > 0.5 ? 2 : -2;
    else if (
      // is turn clockwise?
      (d1.x === 0 && d1.y === -1 && d2.x === 1 && d2.y === 0) ||
      (d1.x === 1 && d1.y === 0 && d2.x === 0 && d2.y === 1) ||
      (d1.x === 0 && d1.y === 1 && d2.x === -1 && d2.y === 0) ||
      (d1.x === -1 && d1.y === 0 && d2.x === 0 && d2.y === -1)
    )
      return 1;
    // turn must be anti-clockwise
    else return -1;
  }
  isSameCell(chaser) {
    return (
      chaser !== this &&
      chaser.pos.x === this.pos.x &&
      chaser.pos.y === this.pos.y
    );
  }
  update(progress, counter) {
    if (counter <= 2) {
      if (this.crash > 0) {
        this.crash -= 1;
        this.angle += 0.22;
      } else {
        this.x += this.dir.x;
        this.y += this.dir.y;
        this.pos = this.GridPos;

        const centrePos = this.centrePoint;
        if (this.isGoingNS)
          if (this.x > centrePos.x) this.x -= 1;
          else if (this.x < centrePos.x) this.x += 1;
        if (this.isGoingEW)
          if (this.y > centrePos.y) this.y -= 1;
          else if (this.y < centrePos.y) this.y += 1;

        let rev = false;
        if (this.isEnterCell) {
          // check to see if cell just entered already has another chaser, if so reverse (for now)
          for (const chaser of game.chasers.chasers) {
            if (this.isSameCell(chaser)) {
              // this.reverse();
              rev = true;
            }
          }

          if (rev) {
            this.reverse();
          } else {
            // calc if a turn is needed, and if so set this.dir and this.rotate
            const directions = this.directions;

            if (directions.length == 1) {
              // set the current direction to the only posibility and rotate
              this.rotate = this.rotation(this.dir, directions[0]);
              this.dir = directions[0];
            } else {
              // there are 2/3 options, so use a PathFinder to decide which one to use
              const pathFinder = new PathFinder(this.pos, directions);
              const direction = pathFinder.search();

              // set the current direction and rotate if different to previous direction
              this.rotate = this.rotation(this.dir, direction);
              this.dir = direction;
            }
          }
        }

        const rotationSpeed = 0.12;
        const north = 0;
        const east = Math.PI * 0.5;
        const south = Math.PI;
        const west = Math.PI * 1.5;

        if (this.rotate === 0) {
          if (this.isGoingNorth) this.angle = north;
          else if (this.isGoingEast) this.angle = east;
          else if (this.isGoingSouth) this.angle = south;
          else this.angle = west;
        } else {
          if (this.angle < 0) this.angle += Math.PI * 2;
          if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;

          if (this.isGoingEast && Math.abs(this.angle - east) > rotationSpeed) {
            this.angle += this.rotate * rotationSpeed;
            if (Math.abs(this.angle - east) < rotationSpeed) {
              this.rotate = 0;
              this.angle = east;
            }
          }

          if (
            this.isGoingSouth &&
            Math.abs(this.angle - south) > rotationSpeed
          ) {
            this.angle += this.rotate * rotationSpeed;
            if (Math.abs(this.angle - south) < rotationSpeed) {
              this.rotate = 0;
              this.angle = south;
            }
          }

          if (this.isGoingNorth && Math.abs(this.angle) > rotationSpeed) {
            this.angle += this.rotate * rotationSpeed;
            if (Math.abs(this.angle) < rotationSpeed) {
              this.rotate = 0;
              this.angle = north;
            }
          }

          if (this.isGoingWest && Math.abs(this.angle - west) > rotationSpeed) {
            this.angle += this.rotate * rotationSpeed;
            if (Math.abs(this.angle - west) < rotationSpeed) {
              this.rotate = 0;
              this.angle = west;
            }
          }
        }
      }
    }
  }
  draw() {
    const pos = Map.Convert(this.x, this.y);
    // const pos = Map.Convert(this.pos.x, this.pos.y);
    Game.View.save();
    Game.View.translate(pos.x, pos.y);
    Game.View.rotate(this.angle);

    Game.View.drawImage(
      this.image,
      0,
      0,
      24,
      24,
      -0.5 * Car.scale * pos.scale.x, // 0, // pos.x,
      -0.5 * Car.scale * pos.scale.y, // -10, // pos.y,
      Car.scale * pos.scale.x,
      Car.scale * pos.scale.y
    );

    Game.View.restore();

    // Game.View.strokeRect(
    //   pos.x - this.carScale * pos.scale.x * 0.5,
    //   pos.y - this.carScale * pos.scale.y * 0.5,
    //   this.carScale * pos.scale.x,
    //   this.carScale * pos.scale.y
    // );
  }
}
class Chasers {
  constructor(positions) {
    this.chasers = [];
    for (const pos of positions) this.chasers.push(new Chaser(pos));
  }
  update(progress, counter) {
    for (const chaser of this.chasers) chaser.update(progress, counter);
  }
  draw() {
    for (const chaser of this.chasers) chaser.draw();
  }
}
class PathFinder {
  constructor(root, turns) {
    this.walkers = [];
    this.visited = [];

    // store initial values for when fall back is used in search()
    this.initial = { root, turns };

    for (let i = 0; i < turns.length; ++i) {
      const walker = new PathWalker(
        structuredClone(root),
        structuredClone(turns[i]),
        structuredClone(turns[i]),
        this.walkers,
        this.visited
      );
      this.walkers.push(walker);
    }
  }
  search() {
    const finish = performance.now() + 30;
    while (performance.now() < finish) {
      const length = this.walkers.length;
      for (let i = 0; i < length; ++i) {
        const walker = this.walkers[i];
        const path = walker.step();
        if (path !== null) return path;
      }
    }
    // optimum path to car not found quickly so fall back to shortest path
    // console.log("shortest");
    const carPos = game.car.GridPos;
    for (const d of this.initial.turns) {
      const x = Math.abs(carPos.x - this.initial.root.x - d.x);
      const y = Math.abs(carPos.y - this.initial.root.y - d.y);
      const x2 = x ** 2;
      const y2 = y ** 2;
      const dist = x2 + y2;
      d.dist = dist;
    }
    const closest = this.initial.turns.reduce((p, c) =>
      p.dist < c.dist ? p : c
    );
    return closest;
  }
}
class PathWalker {
  constructor(pos, dir, root, walkers, visited) {
    this.pos = pos;
    this.dir = dir;
    this.root = root;
    this.walkers = walkers;
    this.visited = visited;
    this.isAlive = true;
  }
  // isEmpty(cell) {
  //   return Map.getPosition(cell.x, cell.y) === 0;
  // }
  isEmpty(cell, dir) {
    if (dir) return Map.getPosition(cell.x + dir.x, cell.y + dir.y) === 0;
    else return Map.getPosition(cell.x, cell.y) === 0;
  }
  isFree = (dir) =>
    Map.getPosition(this.pos.x + dir.x, this.pos.y + dir.y) === 0;

  get directions() {
    // get all the possible directions to travel from current position (ignore reverse)
    const options = [];
    const north = { x: 0, y: -1 };
    const south = { x: 0, y: 1 };
    const west = { x: -1, y: 0 };
    const east = { x: 1, y: 0 };

    if (this.dir.y === -1) {
      // going north - ignore south option
      for (const dir of [north, east, west])
        if (this.isEmpty(this.pos, dir)) options.push(dir);
    } else if (this.dir.y === 1) {
      // going south - ignore north option
      for (const dir of [south, west, east])
        if (this.isEmpty(this.pos, dir)) options.push(dir);
    } else if (this.dir.x === -1) {
      // going west - ignore east option
      for (const dir of [west, south, north])
        if (this.isEmpty(this.pos, dir)) options.push(dir);
    } else if (this.dir.x === 1) {
      // going east - ignore west option
      for (const dir of [east, north, south])
        if (this.isEmpty(this.pos, dir)) options.push(dir);
    }

    // if there are no options this is a dead end so reverse is only option
    // if (options.length === 0) options.push({ x: -this.dir.x, y: -this.dir.y });
    if (options.length === 0) this.isAlive = false;

    return options;
  }
  step() {
    if (this.isAlive) {
      const pos = { x: this.pos.x + this.dir.x, y: this.pos.y + this.dir.y };
      const cell = pos.x * 32 + pos.y;
      if (this.isEmpty(pos)) {
        this.pos = pos;

        const carPos = game.car.GridPos;
        if (this.pos.x === carPos.x && this.pos.y === carPos.y)
          return this.root;

        const directions = this.directions;
        if (directions.length > 1) {
          if (this.visited.includes(cell)) {
            this.isAlive = false;
            return null;
          } else {
            this.visited.push(cell);
          }
        }
        this.dir = directions.pop();
        for (const d of directions)
          if (this.walkers.length < 200)
            this.walkers.push(
              new PathWalker(
                structuredClone(this.pos),
                structuredClone(d),
                structuredClone(this.root),
                this.walkers,
                this.visited
              )
            );
      }
    }
    return null;
  }
}
class Map {
  static AspectRatio = 0.65625;
  static SourceHeight = 500; // 1536
  static SourceWidth = Map.SourceHeight * Map.AspectRatio; // 1008
  static X = 345;
  static Y = 1100; //540;
  static Data = [
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1,
      1, 1, 1, 1, 1, 1, 0,
    ],
    [
      0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 1, 0, 1, 1, 1, 0,
    ],
    [
      0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1,
      1, 1, 0, 1, 1, 1, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
      1, 1, 1, 1, 1, 1, 0,
    ],
    [
      1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 0, 1,
    ],
    [
      1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 1,
    ],
    [
      1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 1,
    ],
    [
      0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1,
      1, 1, 1, 0, 1, 0, 1,
    ],
    [
      0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1,
      1, 1, 1, 0, 1, 0, 1,
    ],
    [
      0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 1,
    ],
    [
      0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 1,
    ],
    [
      0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 1,
    ],
    [
      0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 0,
    ],
    [
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 1, 1, 0, 1, 1,
    ],
    [
      0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 0, 1, 1,
    ],
    [
      0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
      0, 0, 0, 0, 0, 1, 1,
    ],
    [
      0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0,
      0, 1, 1, 1, 0, 0, 1,
    ],
    [
      0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0,
      0, 1, 1, 1, 0, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
      0, 1, 1, 0, 0, 0, 1,
    ],
    [
      1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0,
      0, 1, 1, 0, 1, 0, 1,
    ],
    [
      1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0,
      0, 0, 0, 0, 1, 0, 0,
    ],
    [
      1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
    ],
    [
      1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
      0, 1, 1, 0, 0, 0, 0,
    ],
    [
      0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 1, 1, 0,
    ],
    [
      1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 0,
    ],
    [
      0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0,
      0, 1, 1, 1, 1, 1, 0,
    ],
    [
      0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 0,
    ],
    [
      0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0,
      0, 0, 0, 0, 1, 1, 0,
    ],
    [
      0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0,
    ],
    [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 1, 0, 0, 0, 0,
    ],
  ];
  static getPosition(x, y) {
    if (x < 0 || y < 0 || x > 31 || y > 55) return 1;
    return Map.Data[y][x];
  }
  static Picture(fileName) {
    const i = new Image();
    i.src = fileName;
    return i;
  }
  static mapImage = Map.Picture("images/rally-x-map.png");
  update(progress, counter) {
    if (GameInput.isPanEast && Map.X < 1008) Map.X += 1;
    if (GameInput.isPanWest && Map.X > 0) Map.X -= 1;
    if (GameInput.isPanNorth && Map.Y > 0) Map.Y -= 1;
    if (GameInput.isPanSouth && Map.Y < 1536) Map.Y += 1;

    if (GameInput.isZoomIn) {
      Map.X += 1;
      Map.Y += 1;
      Map.SourceHeight -= 2;
    }

    if (GameInput.isZoomOut) {
      Map.X -= 1;
      Map.Y -= 1;
      Map.SourceHeight += 2;
    }

    Map.SourceWidth = Map.SourceHeight * Map.AspectRatio;
  }
  draw() {
    const xSourceOffset = Map.X;
    const ySourceOffset = Map.Y;
    const xTargetOffset = 0;
    const yTargetOffset = 0;
    const targetWidth = 1008;
    const targetHeight = 1536;

    Game.View.drawImage(
      Map.mapImage,
      xSourceOffset,
      ySourceOffset,
      Map.SourceWidth,
      Map.SourceHeight,
      xTargetOffset,
      yTargetOffset,
      Game.Canvas.width, //targetWidth,
      Game.Canvas.height //targetHeight
    );

    //const zoomX = 1008 / this.sourceWidth;
    //const zoomY = 1536 / this.sourceHeight;
    const zoomX = 1008 / Map.SourceWidth;
    const zoomY = 1536 / Map.SourceHeight;

    const calX = Game.ScaleX * zoomX;
    const calY = Game.ScaleY * zoomY;

    const width = 24 * calX;
    const height = 24 * calY;

    // the top left 5x4 cells are cabbages
    const mapX = width * 5;
    const mapY = height * 4;
    // Game.View.strokeRect(0, 0, width, height);

    if (false) {
      for (let j = 0; j < 56; ++j) {
        for (let i = 0; i < 32; ++i) {
          const x = i * width;
          const y = j * height;
          const offsetX = Map.X * calX;
          const offsetY = Map.Y * calY;
          Game.View.strokeRect(
            mapX + x - offsetX,
            mapY + y - offsetY,
            width - 1,
            height - 1
          );

          Game.View.fillText(
            `(${i},${j})`,
            mapX + x - offsetX + 2,
            mapY + y - offsetY + 10
          );

          if (Map.getPosition(i, j) === 1) {
            Game.View.strokeRect(
              mapX + x - offsetX + width * 0.3,
              mapY + y - offsetY + height * 0.3,
              width * 0.35,
              height * 0.35
            );
          }
        }
      }
    }
    //Game.View.fillRect(504, 820, 16, 16);
  }
  static Convert(x, y) {
    x -= Map.X;
    y -= Map.Y;

    const zoomX = 1008 / Map.SourceWidth;
    const zoomY = 1536 / Map.SourceHeight;

    const calX = Game.ScaleX * zoomX;
    const calY = Game.ScaleY * zoomY;

    // const width = 24 * calX;
    // const height = 24 * calY;

    // the top left 5x4 cells are cabbages
    // const mapX = width * 5;
    // const mapY = height * 4;

    const offsetX = x * calX;
    const offsetY = y * calY;

    const convertedPosition = {
      x: offsetX,
      y: offsetY,
      scale: { x: calX, y: calY },
    };

    return convertedPosition;
  }
}

class Game {
  static Canvas = document.querySelector("canvas");
  static View = Game.Canvas.getContext("2d");
  thisPlayer = null;
  static Game = (() => {
    addEventListener("resize", Game.resize);
  })();
  #previousTimestamp = 0;
  static isPaused = false;
  static ScaleX = 1.0;
  static ScaleY = 1.0;
  static resize() {
    // Game.Canvas.width = window.innerWidth;
    // const newWidth = window.innerHeight * Map.AspectRatio;

    const windowRatio = window.innerWidth / window.innerHeight;
    if (windowRatio > Map.AspectRatio) {
      Game.Canvas.height = window.innerHeight;
      Game.Canvas.width = window.innerHeight * Map.AspectRatio;
    } else {
      Game.Canvas.width = window.innerWidth;
      Game.Canvas.height = window.innerWidth / Map.AspectRatio;
    }

    Game.ScaleX = Game.Canvas.width / 1008;
    Game.ScaleY = Game.Canvas.height / 1536;
    // const xScale = window.innerWidth / Game.vWidth;
    // const yScale = window.innerHeight / Game.vHeight;
    // Game.View.scale(xScale, yScale);
    // Game.View.fillStyle = "white";
    // Game.View.strokeStyle = "white";
    // const scale = (xScale + yScale) / 2;
    // const fontSize = 40 / scale;
    // Game.View.font = `${fontSize}px Lucida Console`;
  }
  setup() {
    const positions = [
      { x: 15, y: 53 },
      { x: 17, y: 53 },
      { x: 13, y: 53 },
      { x: 11, y: 53 },
      { x: 19, y: 53 },
    ];

    this.map = new Map();
    this.car = new Car();
    this.chasers = new Chasers(positions);
    this.flags = new Flags();
    this.smokes = new Smokes();

    this.gameObjects = [];
    this.gameObjects.push(this.map);
    this.gameObjects.push(this.car);
    this.gameObjects.push(this.chasers);
    this.gameObjects.push(this.flags);
    this.gameObjects.push(this.smokes);
  }
  update() {
    GamePad.update();
    if (GameInput.isPaused) {
      Game.isPaused = true;
      return;
    }
    const totalUpdates = 5;
    let counter = 0;
    const progress = 1 / totalUpdates;
    while (++counter <= totalUpdates)
      for (const go of this.gameObjects) go.update(progress, counter);

    this.draw();
  }
  draw() {
    Game.View.clearRect(0, 0, Game.Canvas.width, Game.Canvas.height);

    for (const go of this.gameObjects) go.draw();
  }
  step(timestamp) {
    if (GameInput.isRestart) {
      Game.isPaused = false;
      game = new Game();
      game.start();
    }

    if (Game.isPaused) {
      // check for resume
      GamePad.update();
      if (GameInput.isPaused) Game.isPaused = false;
      if (GameInput.isFrame) this.update();
    } else {
      const framesPerSecond = 30;
      const delay = 1000 / (framesPerSecond + 1);
      const elapsed = timestamp - this.#previousTimestamp;
      if (elapsed > delay) {
        this.update();
        this.#previousTimestamp = timestamp;
      }
    }
    requestAnimationFrame(Game.animate);
  }
  start() {
    // start/setup logic
    Game.resize();

    this.setup();

    requestAnimationFrame(Game.animate);
  }
  static animate = (timestamp) => game.step(timestamp);
}

var game = new Game();
game.start();
