// Configuración global para las pruebas
global.localStorage = {
    data: {},
    getItem: function(key) {
        return this.data[key] || null;
    },
    setItem: function(key, value) {
        this.data[key] = value;
    },
    removeItem: function(key) {
        delete this.data[key];
    },
    clear: function() {
        this.data = {};
    }
};

// Mock para Image
global.Image = class {
    constructor() {
        this.src = '';
        this.complete = true;
        setTimeout(() => {
            if (this.onload) this.onload();
        }, 0);
    }
};

// Mock para Canvas
global.HTMLCanvasElement.prototype.getContext = function() {
    return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: '',
        fillRect: jest.fn(),
        strokeRect: jest.fn(),
        fillText: jest.fn(),
        drawImage: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn()
    };
};

// Mock para requestAnimationFrame
global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 16);
};