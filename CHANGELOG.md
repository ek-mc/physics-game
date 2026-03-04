# Changelog

All notable changes to this project will be documented in this file.

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
