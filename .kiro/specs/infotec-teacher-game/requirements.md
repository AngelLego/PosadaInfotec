# Requirements Document

## Introduction

The INFOTEC Teacher Game is a web-based educational collection game designed for INFOTEC teachers. The system allows multiple teachers to register, play individual collection games, and view statistics grouped by generation. Players control a basket to collect falling programming language logos while avoiding negative objects, with special bonuses for INFOTEC logos.

## Glossary

- **Teacher_System**: The complete game application including user management, gameplay, and statistics
- **Teacher**: A registered user who can play the game
- **Generation**: A numeric classification (1-12) representing the teacher's cohort
- **Game_Session**: An individual gameplay instance associated with a specific teacher
- **Collection_Basket**: The player-controlled object used to catch falling items
- **Programming_Logo**: Positive collectible objects representing programming languages
- **INFOTEC_Logo**: Special collectible object that provides bonus points
- **Carbon_Object**: Negative collectible object that penalizes the player
- **Game_Statistics**: Aggregated data showing performance metrics by teacher and generation

## Requirements

### Requirement 1

**User Story:** As a teacher, I want to register in the system with my basic information, so that I can play the game and track my progress.

#### Acceptance Criteria

1. WHEN a teacher accesses the registration interface THEN the Teacher_System SHALL display input fields for name and generation
2. WHEN a teacher submits registration data THEN the Teacher_System SHALL validate that generation is between 1 and 12
3. WHEN valid registration data is provided THEN the Teacher_System SHALL store the teacher's name and generation
4. WHEN a teacher attempts to register with invalid generation THEN the Teacher_System SHALL prevent registration and display an error message
5. WHEN registration is successful THEN the Teacher_System SHALL confirm the teacher's registration

### Requirement 2

**User Story:** As a registered teacher, I want to start a new game session, so that I can play the collection game and earn points.

#### Acceptance Criteria

1. WHEN a registered teacher selects start game THEN the Teacher_System SHALL create a new Game_Session associated with that teacher
2. WHEN a Game_Session begins THEN the Teacher_System SHALL display the Collection_Basket and start spawning falling objects
3. WHEN a Game_Session is active THEN the Teacher_System SHALL allow basket movement to collect objects
4. WHEN a Game_Session starts THEN the Teacher_System SHALL initialize the score to zero and carbon counter to zero

### Requirement 3

**User Story:** As a player, I want to control a basket to collect programming logos, so that I can earn points during the game.

#### Acceptance Criteria

1. WHEN Programming_Logo objects fall from the top THEN the Teacher_System SHALL allow the Collection_Basket to collect them
2. WHEN a Programming_Logo is collected THEN the Teacher_System SHALL increment the player's score
3. WHEN an INFOTEC_Logo is collected THEN the Teacher_System SHALL apply a special bonus to the score
4. WHEN objects are falling THEN the Teacher_System SHALL maintain smooth gameplay without perceptible delays

### Requirement 4

**User Story:** As a player, I want to avoid carbon objects while playing, so that I don't get penalized and lose the game.

#### Acceptance Criteria

1. WHEN a Carbon_Object is collected THEN the Teacher_System SHALL increment the carbon counter by one
2. WHEN the carbon counter reaches three THEN the Teacher_System SHALL immediately end the Game_Session
3. WHILE a Game_Session is active THEN the Teacher_System SHALL display the current carbon count visually
4. WHEN a Carbon_Object is collected THEN the Teacher_System SHALL apply a penalty to the game state

### Requirement 5

**User Story:** As a teacher, I want my game results to be saved automatically, so that I can track my performance over time.

#### Acceptance Criteria

1. WHEN a Game_Session ends THEN the Teacher_System SHALL store the final score associated with the teacher
2. WHEN a Game_Session ends THEN the Teacher_System SHALL record the teacher's generation with the game result
3. WHEN a Game_Session ends THEN the Teacher_System SHALL save the current date with the game result
4. WHEN game data is stored THEN the Teacher_System SHALL maintain data integrity between teachers and their results

### Requirement 6

**User Story:** As a teacher, I want to view my individual statistics, so that I can see my personal gaming performance.

#### Acceptance Criteria

1. WHEN a teacher requests individual statistics THEN the Teacher_System SHALL display all games played by that teacher
2. WHEN individual statistics are shown THEN the Teacher_System SHALL include scores, dates, and game count
3. WHEN displaying personal stats THEN the Teacher_System SHALL show the teacher's best performance metrics

### Requirement 7

**User Story:** As a teacher, I want to see generation-based statistics, so that I can compare performance across different teacher cohorts.

#### Acceptance Criteria

1. WHEN generation statistics are requested THEN the Teacher_System SHALL group results by generation numbers 1 through 12
2. WHEN displaying generation stats THEN the Teacher_System SHALL show aggregated performance metrics for each generation
3. WHEN generation data is presented THEN the Teacher_System SHALL include average scores and participation counts

### Requirement 8

**User Story:** As a teacher, I want to see rankings of top performers, so that I can see how I compare to other teachers.

#### Acceptance Criteria

1. WHEN rankings are displayed THEN the Teacher_System SHALL show teachers ordered by highest scores
2. WHEN rankings are shown THEN the Teacher_System SHALL include the teacher's generation information
3. WHEN displaying rankings THEN the Teacher_System SHALL present the data in a clear, organized format

### Requirement 9

**User Story:** As a system administrator, I want user data to persist between sessions, so that teachers don't lose their progress.

#### Acceptance Criteria

1. WHEN the Teacher_System is restarted THEN the Teacher_System SHALL retain all registered teacher information
2. WHEN the Teacher_System is restarted THEN the Teacher_System SHALL preserve all historical game results
3. WHEN new teachers register THEN the Teacher_System SHALL accommodate them without affecting existing data
4. WHEN the system operates THEN the Teacher_System SHALL maintain data integrity across all operations