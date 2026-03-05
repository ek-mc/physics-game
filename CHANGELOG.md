# Changelog

## [0.5.4] - 2026-03-05
### Fixed
- Removed remaining old circular-motion prompt variant from idea-question set.
- Replaced with the new precise pair (constant non-zero `ω` and zero `α`).

## [0.5.3] - 2026-03-05
### Fixed
- Global best logic now prioritizes highest **correct answers count** (e.g. 19/20 beats 10/10 in global panel), then accuracy, then streak.
- Clarified global-best label text in UI.

## [0.5.2] - 2026-03-05
### Changed
- Improved Greek phrasing for no-time kinematics prompt (train scenario) to sound natural and explicit.

## [0.5.1] - 2026-03-05
### Changed
- Rewrote awkward circular-motion wording in natural Greek.
- Split ambiguous item into two precise questions:
  1) which quantity is constant and non-zero,
  2) which quantity is zero in uniform rotation.

## [0.5.0] - 2026-03-05
### Fixed
- Reworded ambiguous kinematics prompt ("αλλάζει πορεία") to explicit straight-line motion wording.

## [0.4.9] - 2026-03-05
### Fixed
- Corrected context mismatch in word-problem phrasing:
  - removed rotating-disk context from linear-kinematics (`v = v₀ + at`) questions.
  - clarified wording to explicitly state straight-line motion.

## [0.4.8] - 2026-03-05
### Changed
- Improved Greek phrasing for the position-with-time kinematics formula prompt.

## [0.4.7] - 2026-03-05
### Changed
- Updated projectile-notation display to underscore style (`v_0x`, `v_0y`) in question text/explanations.

## [0.4.6] - 2026-03-05
### Changed
- Improved Greek wording for projectile-motion component questions (more natural phrasing: "της αρχικής ταχύτητας").

## [0.4.5] - 2026-03-05
### Added
- Enriched **Τύποι (mixed)** with concept-symbol questions (e.g. `a` = επιτάχυνση, `v` = ταχύτητα, `x` = θέση, `t` = χρόνος, `g`, `m`, `W`, `P`, `U`).

## [0.4.4] - 2026-03-05
### Added
- Expanded Kinematics question pool with new topics requested from lecture notes context:
  - Κατακόρυφη κίνηση στο πεδίο βαρύτητας
  - Πλάγια βολή
  - Κυκλική κίνηση
  - Ομαλή κυκλική κίνηση

## [0.4.3] - 2026-03-05
### Fixed
- Favicon path changed to relative (`favicon.svg`) for correct loading on GitHub Pages subpath.

## [0.4.2] - 2026-03-05
### Added
- Added explicit ΘΜΚΕ and ΑΔΜΕ questions in Energy and Formulas sections.
- Included both conceptual-use questions and direct formula-identification items.

## [0.4.1] - 2026-03-05
### Added
- New inverse Dynamics question patterns:
  - given `m` and `a` -> find resultant force `ΣF`
  - given `ΣF` and `a` -> find mass `m`
- Reduces over-focus on “find acceleration” only.

## [0.4.0] - 2026-03-05
### Fixed
- Corrected typo in Greek prompt text: "ττη" -> "τη".

## [0.3.9] - 2026-03-05
### Fixed
- Best-score panel now also shows a **Global best** across all saved modes/settings, so progress remains visible even when current random settings differ.

## [0.3.8] - 2026-03-05
### Added
- New chapter: **Τύποι (mixed)** with randomized formula-identification questions across all sections (kinematics, dynamics, rotation, energy).

## [0.3.7] - 2026-03-05
### Added
- Keyboard shortcut: pressing `Space` advances to the next question when the Next button is available.

### Changed
- Upgraded Dynamics `a–F` graph questions to include proper axis scales, ticks, and highlighted read-point, so values are truly read from graph (not just conceptual sketch).

## [0.3.6] - 2026-03-05
### Added
- Expanded **Dynamics hard** pool with broader topics (resultant logic, force-mass scaling, tension-style setups), not only `N` / `f_k` patterns.
- Added Dynamics graph questions (a–F and a–m) with inline visual graph cards.

### Changed
- Dynamics chapter mode now guarantees graph presence (when available), like kinematics mode.

## [0.3.5] - 2026-03-05
### Added
- New **hard** kinematics variety (method-selection, 2-step stopping-distance, and sign/interpretation questions), not only `v²=v₀²+2aΔx` patterns.

## [0.3.4] - 2026-03-05
### Fixed
- Corrected Greek grammar in dynamics option wording to nominative subject form:
  - "Η συνισταμένη των δυνάμεων ..."

## [0.3.3] - 2026-03-05
### Changed
- Minor Greek wording/grammar polish in multiple-choice options (e.g. "την αρχική ταχύτητα", clearer resultant-force phrasing).

## [0.3.2] - 2026-03-05
### Changed
- Standardized friction notation to precise symbols in Greek prompts:
  - kinetic friction as `f_k = μ_k N` (instead of ambiguous shorthand `f = μN`).

## [0.3.1] - 2026-03-05
### Changed
- Reworded dynamics conceptual prompt to sound more natural and problem-like in Greek.
- Improved option wording for acceleration-direction logic (resultant/prevailing force phrasing).

## [0.3.0] - 2026-03-05
### Changed
- Improved Greek phrasing for question prompts (e.g. "Σε οριζόντιο επίπεδο χωρίς τριβή" instead of abbreviated wording).
- Clarified conceptual wording in normal-force question text.

## [0.2.9] - 2026-03-05
### Fixed
- Eliminated duplicate answer options within the same question (e.g. same numeric value appearing twice).
- Added option sanitization so each question keeps 4 unique choices while preserving the correct answer mapping.

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
