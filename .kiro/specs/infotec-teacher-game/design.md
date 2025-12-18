# Design Document

## Overview

The INFOTEC Teacher Game is a web-based collection game built with modern web technologies. The system consists of a client-side game engine for real-time gameplay, a persistent storage layer for user data and game results, and a statistics engine for performance analytics. The architecture emphasizes simplicity, performance, and data integrity while providing an engaging gaming experience for teachers.

## Architecture

The system follows a client-side architecture with local storage persistence:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Game Engine   │    │  User Manager    │    │ Statistics      │
│   - Gameplay    │◄──►│  - Registration  │◄──►│ - Individual    │
│   - Physics     │    │  - Authentication│    │ - Generation    │
│   - Rendering   │    │  - Data Storage  │    │ - Rankings      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌──────────────────┐
                    │ Local Storage    │
                    │ - User Data      │
                    │ - Game Results   │
                    │ - Statistics     │
                    └──────────────────┘
```

## Components and Interfaces

### Game Engine
- **GameSession**: Manages individual game instances
- **CollectionBasket**: Handles player input and basket movement
- **FallingObject**: Base class for all collectible items
- **ScoreManager**: Tracks points and penalties
- **GameRenderer**: Handles visual display and animations

### User Management
- **TeacherRegistry**: Manages teacher registration and validation
- **SessionManager**: Associates games with teachers
- **DataValidator**: Ensures data integrity and validation rules

### Statistics Engine
- **IndividualStats**: Calculates per-teacher metrics
- **GenerationStats**: Aggregates data by generation
- **RankingCalculator**: Generates leaderboards

### Storage Layer
- **LocalStorageAdapter**: Handles browser local storage operations
- **DataSerializer**: Converts objects to/from storage format
- **BackupManager**: Ensures data persistence and recovery

## Data Models

### Teacher
```typescript
interface Teacher {
  id: string;
  name: string;
  generation: number; // 1-12
  registrationDate: Date;
}
```

### GameResult
```typescript
interface GameResult {
  id: string;
  teacherId: string;
  score: number;
  carbonCount: number;
  gameDate: Date;
  duration: number;
}
```

### FallingObject Types
```typescript
interface ProgrammingLogo {
  type: 'programming';
  language: string;
  points: number;
  sprite: string;
}

interface InfotecLogo {
  type: 'infotec';
  bonusMultiplier: number;
  sprite: string;
}

interface CarbonObject {
  type: 'carbon';
  penalty: boolean;
  sprite: string;
}
```
## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated to eliminate redundancy:

- Properties 5.1, 5.2, and 5.3 (storing score, generation, and date) can be combined into a comprehensive "game result persistence" property
- Properties 6.2 and 6.3 (statistics content) can be merged into a single property about statistics completeness
- Properties 9.1 and 9.2 (teacher and game result persistence) can be combined into a general persistence property

**Property 1: Generation validation**
*For any* registration attempt, the system should accept generation values if and only if they are integers between 1 and 12 inclusive
**Validates: Requirements 1.2, 1.4**

**Property 2: Teacher data persistence**
*For any* valid teacher registration, the stored teacher data should exactly match the input data provided
**Validates: Requirements 1.3**

**Property 3: Game session association**
*For any* registered teacher who starts a game, the created game session should be properly associated with that teacher's profile
**Validates: Requirements 2.1**

**Property 4: Initial game state**
*For any* new game session, the initial score should be zero and the carbon counter should be zero
**Validates: Requirements 2.4**

**Property 5: Programming logo collection**
*For any* programming logo that collides with the collection basket, the logo should be collected and the score should increase
**Validates: Requirements 3.1, 3.2**

**Property 6: INFOTEC bonus scoring**
*For any* INFOTEC logo collection, the score increase should be greater than the score increase from collecting a regular programming logo
**Validates: Requirements 3.3**

**Property 7: Carbon counter increment**
*For any* carbon object collection, the carbon counter should increase by exactly one
**Validates: Requirements 4.1**

**Property 8: Game termination on carbon limit**
*For any* game session, when the carbon counter reaches exactly three, the game should immediately terminate
**Validates: Requirements 4.2**

**Property 9: Carbon counter visibility**
*For any* active game session, the current carbon count should be visible and accurately reflect the number of carbon objects collected
**Validates: Requirements 4.3**

**Property 10: Game result persistence**
*For any* completed game session, the stored result should include the final score, teacher's generation, and game completion date
**Validates: Requirements 5.1, 5.2, 5.3**

**Property 11: Teacher-result association integrity**
*For any* stored game result, it should be correctly associated with exactly one teacher and that association should remain consistent
**Validates: Requirements 5.4**

**Property 12: Individual statistics filtering**
*For any* teacher requesting individual statistics, the displayed results should include only games played by that specific teacher
**Validates: Requirements 6.1**

**Property 13: Statistics completeness**
*For any* individual statistics display, it should include all required information: scores, dates, game count, and best performance metrics
**Validates: Requirements 6.2, 6.3**

**Property 14: Generation grouping**
*For any* generation statistics request, results should be grouped such that each generation (1-12) contains only games from teachers of that generation
**Validates: Requirements 7.1**

**Property 15: Generation metrics accuracy**
*For any* generation's statistics, the displayed average scores and participation counts should accurately reflect the actual game data for that generation
**Validates: Requirements 7.2, 7.3**

**Property 16: Ranking order correctness**
*For any* ranking display, teachers should be ordered by highest score first, with generation information included for each teacher
**Validates: Requirements 8.1, 8.2**

**Property 17: Data persistence across restarts**
*For any* system restart, all previously stored teacher information and game results should remain intact and accessible
**Validates: Requirements 9.1, 9.2**

**Property 18: Data isolation for new registrations**
*For any* new teacher registration, the addition should not modify, delete, or corrupt any existing teacher or game result data
**Validates: Requirements 9.3**

## Error Handling

The system implements comprehensive error handling across all components:

### Input Validation Errors
- Invalid generation numbers (outside 1-12 range)
- Empty or invalid teacher names
- Malformed data during registration

### Game State Errors
- Attempting to start games for unregistered teachers
- Invalid game session states
- Collision detection failures

### Storage Errors
- Local storage quota exceeded
- Data corruption detection and recovery
- Serialization/deserialization failures

### Recovery Mechanisms
- Graceful degradation when storage is unavailable
- Data validation before storage operations
- Backup and restore capabilities for critical data

## Testing Strategy

The system employs a dual testing approach combining unit tests and property-based tests:

### Unit Testing
- Specific examples demonstrating correct behavior
- Edge cases like empty inputs and boundary values
- Integration points between game components
- Error condition handling

### Property-Based Testing
- **Framework**: fast-check for JavaScript/TypeScript
- **Configuration**: Minimum 100 iterations per property test
- **Coverage**: All 18 correctness properties listed above
- **Tagging**: Each property test tagged with format: `**Feature: infotec-teacher-game, Property {number}: {property_text}**`

### Test Categories
1. **Registration Tests**: Validate user registration and data storage
2. **Gameplay Tests**: Verify game mechanics and scoring
3. **Statistics Tests**: Ensure accurate data aggregation and display
4. **Persistence Tests**: Confirm data survives system restarts
5. **Integration Tests**: Test component interactions

### Testing Requirements
- Each correctness property implemented by exactly one property-based test
- Property tests validate universal behaviors across all valid inputs
- Unit tests cover specific examples and integration scenarios
- Both test types are complementary and required for comprehensive coverage