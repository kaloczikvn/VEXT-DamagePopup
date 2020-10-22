const BASE_MS = 800;
const RAND_MS = 280;
const DEFAULT_TEXT_SCALE = 0.5;

let camera, scene, renderer, hits = [];

window.addEventListener('resize', onWindowResize, false);
init();
animate();

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		90, //FIXME: Sync with VU
		window.innerWidth / window.innerHeight,
		0.01,
		1500
	);
	camera.rotation.order = 'YXZ';

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor(0x000000, 0);
	renderer.setClearAlpha(0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function moveCamera(data) {
	camera.position.set(data.x, data.y, data.z);
	camera.rotation.set(data.pitch, -data.yaw + Math.PI, 0);
}

function animate() {
	requestAnimationFrame(animate);
	drawHits();
	renderer.render(scene, camera);
}

function drawHits() {
	if (hits.length < 1) return;

	hits.forEach(hit => hit.render())
	
	hits.map((hit, index, object) => {
		if(hit.endMs <= Date.now()) {
			hit.removeObject();
			object.splice(index, 1);
		}
	});
}

function addHit(damage, isHeadshot, posX, posY, posZ) {
	//if (isHeadshot) playHeadshot()
	hits.push(new HitEffect(damage, isHeadshot, posX, posY, posZ));
}

class HitEffect {
	constructor(damage, isHeadshot = false, posX, posY, posZ) {
		this.posX = posX;
		this.posY = posY + 0.15;
		this.posZ = posZ;

		this.object = new SpriteText(damage);
		this.object.textHeight = 1;
		this.object.strokeWidth = 1;
		this.object.strokeColor = '#000000';
		this.object.color = (isHeadshot ? '#FF9C37' : '#ffffff');
		this.object.padding = 1;
		this.object.fontFace = 'bffont';
		this.object.scale.set(DEFAULT_TEXT_SCALE, DEFAULT_TEXT_SCALE, DEFAULT_TEXT_SCALE);
		this.object.position.set(this.posX, this.getYCoordinate(), this.posZ);
		scene.add(this.object);

		this.isHeadshot = isHeadshot;

		this.startMs = Date.now();
		this.endMs = this.randomEndMs();
	}

	randomEndMs() {
		return this.startMs + BASE_MS + Math.floor(Math.random() * RAND_MS);
	}

	removeObject() {
		scene.remove(this.object);
	}

	getPrc() {
		return (Date.now() - this.startMs) / (this.endMs - this.startMs);
	}

	getYCoordinate() {
		return this.posY + this.getPrc() * 2;
	}

	setObjectOpacity() {
		const prc = 1 - this.getPrc();

		this.object.strokeColor = 'rgba(0, 0, 0, ' + prc + ')';
		if(this.isHeadshot) {
			this.object.color = 'rgba(255, 156, 55, ' + prc + ')';
		} else {
			this.object.color = 'rgba(255, 255, 255, ' + prc + ')';
		}
	}

	setTextScaleBasedOnCameraDistance() {
		var distance = this.object.position.distanceTo(camera.position);
		var scale = DEFAULT_TEXT_SCALE + (distance / 15);
		this.object.scale.set(scale, scale, scale)
	}

	render() {
		this.setObjectOpacity();
		this.setTextScaleBasedOnCameraDistance();
		this.object.position.set(this.posX, this.getYCoordinate(), this.posZ);
	}
}
