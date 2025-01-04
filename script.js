// Import Matter.js
const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

// Create an engine
const engine = Engine.create();
const world = engine.world;

// Create a renderer
const canvas = document.getElementById('simulationCanvas');
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
World.add(world, mouseConstraint);

// Add some bodies
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { isStatic: true });
World.add(world, ground);

// Function to create a new circle
function createCircle(x, y) {
    const circle = Bodies.circle(x, y, 20);
    World.add(world, circle);
}

// Event listener for mouse clicks
canvas.addEventListener('click', (event) => {
    createCircle(event.clientX, event.clientY);
});

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
