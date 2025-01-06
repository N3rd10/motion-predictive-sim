// Import Matter.js
const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Body } = Matter;

// Create an engine
const engine = Engine.create();
const world = engine.world;

// Create a renderer
const canvas = document.getElementById('simulationCanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: canvas.width,
        height: canvas.height,
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

// Function to enable moving shapes
let isMoving = false;

function enableMove() {
    isMoving = true;
    canvas.style.cursor = 'move'; // Change cursor to indicate moving mode
}

function disableMove() {
    isMoving = false;
    canvas.style.cursor = 'default'; // Reset cursor
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

document.getElementById('move').addEventListener('click', () => {
    if (isMoving) {
        disableMove();
    } else {
        enableMove();
    }
});

document.getElementById('clear').addEventListener('click', clearAll);

// Function to draw an arrow
function drawArrow(context, fromX, fromY, toX, toY) {
    const headLength = 10; // Length of the arrow head
    const angle = Math.atan2(toY - fromY, toX - fromX);

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    context.moveTo(toX, toY);
    context.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    context.strokeStyle = 'red'; // Arrow color
    context.lineWidth = 2; // Arrow width
    context.stroke();
}

// Update the draw function to include the arrow
function update() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render the Matter.js world
    Render.world(render);
    
    // Draw the arrow if an object is being moved
    if (isMoving) {
        const mousePosition = { x: mouse.position.x, y: mouse.position.y };
        const bodies = Matter.Composite.allBodies(world);
        const clickedBody = bodies.find(body => Matter.Bounds.contains(body.bounds, mousePosition));

        if (clickedBody) {
            const futureX = clickedBody.position.x + (clickedBody.velocity.x * 1); // 1 second
            const futureY = clickedBody.position.y + (clickedBody.velocity.y * 1); // 1 second
            drawArrow(render.canvas.getContext('2d'), clickedBody.position.x, clickedBody.position.y
