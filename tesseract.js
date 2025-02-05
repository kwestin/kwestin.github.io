// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('tesseractCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.z = 4;

// Generate vertices for a 4D tesseract
function generateTesseractVertices() {
    const vertices = [];
    for (let i = 0; i < 16; i++) {
        let vertex = [];
        for (let j = 0; j < 4; j++) {
            vertex.push(((i >> j) & 1) ? 1 : -1); // Generate coordinates as -1 or 1
        }
        vertices.push(vertex);
    }
    return vertices;
}

// Generate edges by connecting vertices differing by exactly one coordinate
function generateEdges(vertices) {
    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
            let diffCount = 0;
            for (let k = 0; k < 4; k++) {
                if (vertices[i][k] !== vertices[j][k]) {
                    diffCount++;
                }
            }
            if (diffCount === 1) {  // Only connect vertices differing in one coordinate
                edges.push([vertices[i], vertices[j]]);
            }
        }
    }
    return edges;
}

// Project 4D vertices into 3D space using perspective projection
function project4Dto3D(vertex) {
    const w = vertex[3] + 4; // Apply a simple perspective division to simulate depth
    return new THREE.Vector3(vertex[0] / w, vertex[1] / w, vertex[2] / w);
}

// Create lines (edges) for the tesseract
function createTesseractLines(vertices, edges) {
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const geometry = new THREE.BufferGeometry();

    edges.forEach(edge => {
        const v1 = project4Dto3D(edge[0]);
        const v2 = project4Dto3D(edge[1]);

        geometry.setFromPoints([v1, v2]);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    });
}

// Set up the tesseract and its edges
let vertices = generateTesseractVertices();
let edges = generateEdges(vertices);
createTesseractLines(vertices, edges);

// Define a 4D rotation matrix
let rotationMatrix = [
    [Math.cos(0.01), -Math.sin(0.01), 0, 0],
    [Math.sin(0.01), Math.cos(0.01), 0, 0],
    [0, 0, Math.cos(0.01), -Math.sin(0.01)],
    [0, 0, Math.sin(0.01), Math.cos(0.01)]
];

// Function to rotate the vertices in 4D space
function rotateVertices(vertices, matrix) {
    return vertices.map(vertex => {
        return vertex.map((coord, idx) => {
            return matrix[idx].reduce((sum, val, i) => sum + val * vertex[i], 0);
        });
    });
}

// Animate the scene and rotate the tesseract
function animate() {
    requestAnimationFrame(animate);

    // Clear the scene for each frame
    scene.clear();

    // Apply the 4D rotation matrix to the vertices
    vertices = rotateVertices(vertices, rotationMatrix);
    edges = generateEdges(vertices); // Regenerate the edges after rotation

    // Recreate the lines with the rotated vertices
    createTesseractLines(vertices, edges);

    // Rotate the 4D rotation matrix slightly to "morph" the tesseract
    rotationMatrix[0][0] += 0.001;
    rotationMatrix[1][1] += 0.001;

    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
