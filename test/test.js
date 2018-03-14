'use strict';

const { expect } = require('chai');

const glfw = require('glfw-raub');


const classes = {
	
	Window: {
		create() {
			return new glfw.Window();
		},
		props: [
			'handle','width','height','w','h','wh','size','title','icon',
			'msaa','version','shouldClose','platformWindow','platformContext',
			'pos','framebufferSize','currentContext','cursorPos',
		],
		methods: [
			'getKey','getMouseButton','getWindowAttrib','setInputMode','swapBuffers',
			'makeCurrent','destroy','iconify','restore','hide','show',
		],
	},
	
	Document: {
		create() {
			return new glfw.Document();
		},
		props: [
			'body','ratio','devicePixelRatio','innerWidth','innerHeight',
			'clientWidth','clientHeight','onkeydown','onkeyup','style','context',
		],
		methods: [
			'getContext','getElementById','getElementsByTagName',
			'createElementNS','createElement','dispatchEvent',
			'addEventListener','removeEventListener','requestAnimationFrame',
		],
	},
	
};


describe('GLFW', () => {
	
	it(`exports an object`, () => {
		expect(glfw).to.be.an('object');
	});
	
	
	Object.keys(classes).forEach(
		c => {
			it(`${c} is exported`, () => {
				expect(glfw).to.respondTo(c);
			});
		}
	);
	
	Object.keys(classes).forEach(c => describe(c, () => {
		
		const current = classes[c];
		
		it(`can be created`, () => {
			expect(current.create()).to.be.an('object');
		});
		
		
		current.props.forEach(prop => {
			it(`#${prop} property exposed`, () => {
				expect(current.create()).to.have.property(prop);
			});
		});
		
		current.methods.forEach(method => {
			it(`#${method}() method exposed`, () => {
				expect(current.create()).to.respondTo(method);
			});
		});
		
	}));
	
});
