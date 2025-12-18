const fc = require('fast-check');

// Importar las clases del juego (simulando un entorno de módulos)
// En un entorno real, estas clases estarían en módulos separados
eval(require('fs').readFileSync('game.js', 'utf8'));

describe('INFOTEC Teacher Game Tests', () => {
    
    beforeEach(() => {
        // Limpiar localStorage antes de cada prueba
        localStorage.clear();
    });
    
    /**
     * **Feature: infotec-teacher-game, Property 17: Data persistence across restarts**
     * **Validates: Requirements 9.1, 9.2**
     */
    describe('Property 17: Data persistence across restarts', () => {
        test('teacher data persists across system restarts', () => {
            fc.assert(fc.property(
                fc.string({ minLength: 1, maxLength: 50 }),
                fc.integer({ min: 1, max: 12 }),
                (name, generation) => {
                    // Crear y guardar un docente
                    const teacher = new Teacher(
                        'teacher_' + Date.now() + Math.random(),
                        name.trim(),
                        generation
                    );
                    
                    LocalStorageAdapter.saveTeacher(teacher);
                    
                    // Simular reinicio del sistema obteniendo los datos
                    const retrievedTeachers = LocalStorageAdapter.getTeachers();
                    
                    // Verificar que el docente persiste
                    expect(retrievedTeachers[teacher.id]).toBeDefined();
                    expect(retrievedTeachers[teacher.id].name).toBe(teacher.name);
                    expect(retrievedTeachers[teacher.id].generation).toBe(teacher.generation);
                    expect(retrievedTeachers[teacher.id].id).toBe(teacher.id);
                }
            ), { numRuns: 100 });
        });
        
        test('game results persist across system restarts', () => {
            fc.assert(fc.property(
                fc.string({ minLength: 1 }),
                fc.integer({ min: 0, max: 10000 }),
                fc.integer({ min: 0, max: 3 }),
                (teacherId, score, carbonCount) => {
                    // Crear y guardar un resultado de juego
                    const gameResult = new GameResult(
                        'game_' + Date.now() + Math.random(),
                        teacherId,
                        score,
                        carbonCount,
                        new Date(),
                        Math.random() * 300000 // duración aleatoria
                    );
                    
                    LocalStorageAdapter.saveGameResult(gameResult);
                    
                    // Simular reinicio del sistema obteniendo los datos
                    const retrievedResults = LocalStorageAdapter.getGameResults();
                    
                    // Verificar que el resultado persiste
                    const foundResult = retrievedResults.find(r => r.id === gameResult.id);
                    expect(foundResult).toBeDefined();
                    expect(foundResult.teacherId).toBe(gameResult.teacherId);
                    expect(foundResult.score).toBe(gameResult.score);
                    expect(foundResult.carbonCount).toBe(gameResult.carbonCount);
                }
            ), { numRuns: 100 });
        });
        
        test('multiple teachers and results persist together', () => {
            fc.assert(fc.property(
                fc.array(fc.record({
                    name: fc.string({ minLength: 1, maxLength: 30 }),
                    generation: fc.integer({ min: 1, max: 12 })
                }), { minLength: 1, maxLength: 10 }),
                (teacherData) => {
                    const teachers = [];
                    const gameResults = [];
                    
                    // Crear y guardar múltiples docentes
                    teacherData.forEach((data, index) => {
                        const teacher = new Teacher(
                            'teacher_' + index + '_' + Date.now(),
                            data.name.trim(),
                            data.generation
                        );
                        teachers.push(teacher);
                        LocalStorageAdapter.saveTeacher(teacher);
                        
                        // Crear algunos resultados para cada docente
                        for (let i = 0; i < 2; i++) {
                            const result = new GameResult(
                                'game_' + index + '_' + i + '_' + Date.now(),
                                teacher.id,
                                Math.floor(Math.random() * 1000),
                                Math.floor(Math.random() * 4),
                                new Date()
                            );
                            gameResults.push(result);
                            LocalStorageAdapter.saveGameResult(result);
                        }
                    });
                    
                    // Simular reinicio y verificar persistencia
                    const retrievedTeachers = LocalStorageAdapter.getTeachers();
                    const retrievedResults = LocalStorageAdapter.getGameResults();
                    
                    // Verificar que todos los docentes persisten
                    teachers.forEach(teacher => {
                        expect(retrievedTeachers[teacher.id]).toBeDefined();
                        expect(retrievedTeachers[teacher.id].name).toBe(teacher.name);
                        expect(retrievedTeachers[teacher.id].generation).toBe(teacher.generation);
                    });
                    
                    // Verificar que todos los resultados persisten
                    gameResults.forEach(result => {
                        const found = retrievedResults.find(r => r.id === result.id);
                        expect(found).toBeDefined();
                        expect(found.teacherId).toBe(result.teacherId);
                        expect(found.score).toBe(result.score);
                    });
                }
            ), { numRuns: 50 });
        });
    });
    
    // Pruebas unitarias básicas para verificar la funcionalidad
    describe('Basic Unit Tests', () => {
        test('Teacher creation with valid data', () => {
            const teacher = new Teacher('test_id', 'Juan Pérez', 5);
            expect(teacher.id).toBe('test_id');
            expect(teacher.name).toBe('Juan Pérez');
            expect(teacher.generation).toBe(5);
            expect(teacher.registrationDate).toBeInstanceOf(Date);
        });
        
        test('GameResult creation with valid data', () => {
            const result = new GameResult('game_id', 'teacher_id', 100, 2);
            expect(result.id).toBe('game_id');
            expect(result.teacherId).toBe('teacher_id');
            expect(result.score).toBe(100);
            expect(result.carbonCount).toBe(2);
            expect(result.gameDate).toBeInstanceOf(Date);
        });
        
        test('FallingObject basic functionality', () => {
            const obj = new FallingObject(100, 50, 'programming', null, 10);
            expect(obj.x).toBe(100);
            expect(obj.y).toBe(50);
            expect(obj.type).toBe('programming');
            expect(obj.points).toBe(10);
            
            const initialY = obj.y;
            obj.update();
            expect(obj.y).toBeGreaterThan(initialY);
        });
        
        test('CollectionBasket movement', () => {
            const basket = new CollectionBasket(100, 500, 800);
            const initialX = basket.x;
            
            basket.moveLeft();
            expect(basket.x).toBeLessThan(initialX);
            
            basket.moveRight();
            basket.moveRight();
            expect(basket.x).toBeGreaterThan(initialX);
        });
        
        test('ScoreManager functionality', () => {
            const scoreManager = new ScoreManager();
            expect(scoreManager.score).toBe(0);
            expect(scoreManager.carbonCount).toBe(0);
            
            scoreManager.addScore(50);
            expect(scoreManager.score).toBe(50);
            
            const gameOver = scoreManager.addCarbon();
            expect(scoreManager.carbonCount).toBe(1);
            expect(gameOver).toBe(false);
            
            scoreManager.addCarbon();
            scoreManager.addCarbon();
            const gameOverNow = scoreManager.addCarbon();
            expect(gameOverNow).toBe(true);
        });
    });
});