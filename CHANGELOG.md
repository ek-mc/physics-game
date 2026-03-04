# Changelog

All notable changes to this project will be documented in this file.

## [0.2.8] - 2026-03-04
### Changed
- Replaced clock-based rotation scenarios with neutral rotating-disk scenarios to avoid conceptual confusion.

## [0.2.7] - 2026-03-04
### Fixed
- Respect selected question count exactly (no forced minimum in chapter mode).

## [0.2.6] - 2026-03-04
### Added
- Added scenario/concept question set with distinct ideas per chapter (vehicle, spaceship, clock, elevator, train, cyclist).

### Changed
- Chapter mode now serves at least 20 questions per run (when available).
- Expanded question count selector up to 60.

## [0.2.5] - 2026-03-04
### Added
- Added many story-based problem questions (vehicle, spaceship, clock, elevator, train, cyclist scenarios).
- Expanded exam-style wording across kinematics, dynamics, rotation, and energy sections.

## [0.2.4] - 2026-03-04
### Changed
- Added diversity-first question picker: avoids same question stem/template repeating in the same run.
- Kinematics mode now applies diversity to both graph and non-graph picks.

## [0.2.3] - 2026-03-04
### Fixed
- Reduced repeated/same-stem questions (dedupe by chapter+difficulty+question text).
- Removed accidental high-frequency repetition of one kinematics formula-stem item.

### Added
- Graph rendering in quiz for selected kinematics items (inline SVG).
- Guaranteed graph presence in Kinematics chapter mode (at least 3 graph questions when available).

## [0.2.2] - 2026-03-04
### Fixed
- Correct-answer mapping bug in generated numeric questions (some items could highlight wrong option after answer shuffle).
- Ensured correct option is preserved before UI-level shuffle.

## [0.2.1] - 2026-03-04
### Added
- Home behavior: clicking `🎯 Physics Game` always returns to homepage/menu.
- Configurable timer per question: 20s / 30s / 45s / 60s.
- New graph-concept question set (x-t and v-t interpretation).

### Changed
- Persisted user menu preferences in `localStorage` (difficulty, count, timer, streak, timer seconds).

## [0.2.0] - 2026-03-04
### Added
- Expanded question bank to 500+ generated questions across all chapters.
- Added difficulty levels: `easy`, `medium`, `hard`, `mixed`.
- Added configurable quiz length: 10 / 20 / 30 questions.
- Added timer mode (20 seconds per question).
- Added streak mode (run ends on first wrong answer / timeout).
- Added best score and best streak persistence via `localStorage`.

### Changed
- Improved question wording clarity (e.g. "σταθερή επιτάχυνση" and explicit "οριζόντιο επίπεδο χωρίς τριβή").
- Refactored quiz flow/UI to support advanced modes.

## [0.1.1] - 2026-03-04
### Added
- Added `CHANGELOG.md`.
- Prepared project for GitHub Pages deployment.

## [0.1.0] - 2026-03-04
### Added
- Initial release of **Physics Game** in Greek.
- Chapter modes: Κινηματική, Δυναμική, Περιστροφή, Έργο-Ενέργεια.
- Random mode: 10 τυχαίες ερωτήσεις.
- Multiple-choice format (A/B/C/D) with trap-style distractors.
- Instant feedback and score tracking.
