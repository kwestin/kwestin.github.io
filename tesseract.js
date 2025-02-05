// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('tesseractCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.z = 4;

// Create a function to generate vertices for a 4D tesseract (Hypercube)
function generateTesseractVertices() {
    const vertices = [];
    for (let i = 0; i < 16; i++) {
        let vertex = [];
        for (let j = 0; j < 4; j++) {
            vertex.push(((i >> j) & 1) * 2 - 1); // generate values -1 or 1
        }
        vertices.push(vertex);
    }
    return vertices;
}

// Create the edges for the tesseract
function generateEdges(vertices) {
    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
            // Only connect points differing in one dimension
            let diffCount = 0;
            for (let k = 0; k < 4; k++) {
                if (vertices[i][k] !== vertices[j][k]) {
                    diffCount++;
                }
            }
            if (diffCount === 1) {
                edges.push([vertices[i], vertices[j]]);
            }
        }
    }
    return edges;
}

// Function to rotate and project 4D vertices to 3D space
function project4Dto3D(vertex, rotationMatrix) {
    // Apply 4D rotation matrix
    let rotated = vertex.map((coord, idx) => {
        return rotationMatrix[idx].reduce((sum, val, i) => sum + val * vertex[i], 0);
    });
    
    // Now project onto 3D space (simple 3D projection)
    return {
        x: rotated[0] / (rotated[3] + 4), // 4D to 3D perspective projection
        y: rotated[1] / (rotated[3] + 4),
        z: rotated[2] / (rotated[3] + 4)
    };
}

// Create tesseract mesh
function createTesseract() {
    const vertices = generateTesseractVertices();
    const edges = generateEdges(vertices);
    
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    edges.forEach(edge => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(edge[0][0], edge[0][1], edge[0][2]),
            new THREE.Vector3(edge[1][0], edge[1][1], edge[1][2])
        ]);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    });
}

// Initialize the tesseract
createTesseract();

// Rotation and morphing controls
let rotationMatrix = [
    [Math.cos(0.01), -Math.sin(0.01), 0, 0],
    [Math.sin(0.01), Math.cos(0.01), 0, 0],
    [0, 0, Math.cos(0.01), -Math.sin(0.01)],
    [0, 0, Math.sin(0.01), Math.cos(0.01)]
];

// Animating the scene
function animate() {
    requestAnimationFrame(animate);

    scene.clear();
    createTesseract(); // Recreate the tesseract with updated rotations

    // Rotate the tesseract each frame
    rotationMatrix[0][0] += 0.001; // Apply slight changes for morphing
    rotationMatrix[1][1] += 0.001;
    rotationMatrix[2][2] += 0.001;

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
