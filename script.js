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

// Add ground
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 10, window.innerWidth, 20, { isStatic: true });
World.add(world, ground);

// Function to create a new circle
function createCircle(x, y) {
    const circle = Bodies.circle(x, y, 20);
    World.add(world, circle);
}

// Function to create a new rectangle
function createRectangle(x, y) {
    const rectangle = Bodies.rectangle(x, y, 40, 20);
    World.add(world, rectangle);
}

// Function to clear all bodies
function clearAll() {
    World.clear(world);
    World.add(world, ground); // Re-add the ground
}

// Event listeners for menu buttons
document.getElementById('addCircle').addEventListener('click', () => {
    canvas.addEventListener('click', (event) => {
        createCircle(event.clientX, event.clientY);
    }, { once: true }); // Only add one circle per click
});

document.getElementById('addRectangle').addEventListener('click', () => {
    canvas.addEventListener('click', (event) => {
        createRectangle(event.clientX, event.clientY);
    }, { once: true }); // Only add one rectangle per click
});

document.getElementById('clear').addEventListener('click', clearAll);

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
