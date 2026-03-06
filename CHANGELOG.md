# Changelog

## [0.8.7] - 2026-03-06
### Changed
- Removed `Nightmare` / `veryhard` difficulty tier.
- Moved all former `veryhard` questions into `hard`.
- Removed `veryhard`-specific runtime selection logic and normalized saved preference to `hard` when needed.

## [0.8.6] - 2026-03-06
### Changed
- Kinematics Nightmare significantly diversified with additional multi-phase motion families (beyond stop-distance and two-stage templates).
- Removed remaining "hint-like" wording from one kinematics prompt (`πρόσημα` phrasing removed).
- Removed worksheet item previously labeled as `(iv)` from kinematics set.
- Varied bridge/meeting scenario parameters and wording to reduce repetition.
- Removed leftover `Πολύ δύσκολο:` prefix from prompt text.

## [0.8.5] - 2026-03-06
### Fixed
- Added missing initial-speed data (`v₀`) in two-stage kinematics final-velocity prompt.

## [0.8.4] - 2026-03-06
### Fixed
- Made a previously context-dependent kinematics prompt self-contained (removed ambiguous "Στο ίδιο δι-στάδιο σενάριο").

## [0.8.3] - 2026-03-06
### Changed
- Nightmare chapter runs now prioritize `veryhard` questions (target ~80%+ when available), then fill remainder from lower levels only if needed.
- Removed forced graph quota from Kinematics chapter (graph-mix rule remains for Dynamics only).

## [0.8.2] - 2026-03-06
### Changed
- Corrected terminology in kinematics prompts: removed misuse of "ΔΕΣ" for `x-t` graphs.
- Prompts now consistently refer to these as `διάγραμμα x-t`.

## [0.8.1] - 2026-03-06
### Added
- Added more kinematics ideas from user screenshots:
  - projectile-to-cup **angle-finding** questions (given speed and target distance/height),
  - two-body **meeting-point** relative-motion questions (start from opposite ends).

## [0.8.0] - 2026-03-06
### Added
- Added new kinematics projectile-from-height problems (ping-pong/cup along table style), including two-step solving (`y(t)` then `x(t)`).

## [0.7.9] - 2026-03-06
### Added
- Added multiple extra rotation idea questions (not just one):
  - period/frequency/ω relations,
  - rpm -> Hz / rad·s⁻¹ conversions,
  - centripetal scaling with v and r,
  - linear speed from ωr,
  - qualitative effects when T changes.

## [0.7.8] - 2026-03-06
### Added
- Added new rotation questions based on clock-hand angular velocity ideas (second hand/minute hand, `ω=2π/T`).

## [0.7.7] - 2026-03-06
### Changed
- Removed labels like "Άσκηση (τύπου X)" and similar prefixes from prompts.
- Prompts now start directly with the scenario text (cleaner exam-like wording).

## [0.7.6] - 2026-03-06
### Changed
- Renamed difficulty label from `Πολύ δύσκολο` to `Nightmare`.
- Fixed repetitive Nightmare runs in chapter mode by:
  - adding more veryhard kinematics multi-step stems,
  - auto-supplementing with `hard`/`medium` chapter pools when veryhard variety is too low.

## [0.7.5] - 2026-03-06
### Changed
- Added automatic difficulty fallback when selected level has no questions (e.g. `Πολύ δύσκολο` -> `hard` -> `medium` -> `easy`) instead of stopping with an alert.

## [0.7.4] - 2026-03-06
### Added
- Added **Energy worksheet-inspired** question set based on uploaded exercise themes:
  - work by applied force/friction,
  - variable-force work from F-x area,
  - vector dot-product work,
  - rope+tension+friction work setup,
  - x(t)->v(t)->K(t) chain,
  - conservative gravity path-independence,
  - pendulum energy method,
  - smooth-ramp + rough-surface transitions,
  - power under constant-speed drag/friction.

## [0.7.3] - 2026-03-06
### Added
- Added **Rotation worksheet-inspired** question set from provided exercise themes:
  - Earth angular/linear speed,
  - time-varying angular acceleration integration forms,
  - angular momentum components,
  - torque vs dL/dt,
  - comparative moments of inertia by axis,
  - constant-torque motion laws,
  - composite-body inertia composition.

## [0.7.2] - 2026-03-06
### Added
- Added new Dynamics worksheet-inspired question set based on provided exercise themes:
  - incline equilibrium & friction coefficient,
  - incline with applied force and constant speed,
  - center of mass (discrete masses),
  - recoil/momentum style,
  - force from velocity change,
  - linear drag model concept,
  - ferris-wheel normal-force comparison.

## [0.7.1] - 2026-03-06
### Added
- New difficulty level: **Πολύ δύσκολο** (`veryhard`) focused on multi-step problems (2+ operations).
- Added mixed very-hard pool across kinematics, dynamics, and energy.

### Changed
- Projectile-motion questions are now generalized for multiple launch angles (not only 45°).

## [0.7.0] - 2026-03-06
### Added
- Major kinematics enrichment with worksheet/exam-style problem families inspired by uploaded exercise screenshots:
  - from-rest constant acceleration (v and distance subparts),
  - `v-t` graph area/slope subparts,
  - bridge encounter boundary-speed style,
  - rotating drum speed + centripetal acceleration,
  - projectile (45°) range + max height subparts.

## [0.6.9] - 2026-03-06
### Added
- Added **worksheet-style kinematics questions** with subparts inspired by lecture exercise format:
  - (i) identify motion type,
  - (ii) compute distance in given time,
  - (iii) infer acceleration in uniform motion,
  - (iv) interval-distance from t to t',
  - (v) slope meaning in x-t graph.
- Focused on non-graph prompt style for these items, matching PDF exercise flow.

## [0.6.8] - 2026-03-06
### Changed
- Result screen now clarifies counting context:
  - shows selected total questions,
  - explicitly indicates early stop when Streak mode ends a run before full count.

## [0.6.7] - 2026-03-06
### Added
- Added unit-identification questions in **Τύποι (mixed)** (m, m/s, m/s², N, J, W, kg, rad/s, rad/s², N·m).

## [0.6.6] - 2026-03-06
### Changed
- Switched graph focus toward **ΔΕΣ (x-t)** style questions in Kinematics.
- Added more displacement-time interpretation items (slope -> velocity, straight-line meaning).
- Removed dynamics `a-F` graph set from active question pool to reduce confusion.

## [Unreleased]

## [0.6.5] - 2026-03-06
### Changed
- Removed highlighted marker/guides from Dynamics `a–F` graphs to avoid visually revealing the answer.
- Updated graph-question wording to match the cleaner chart style.

## [0.6.4] - 2026-03-05
### Added
- Home-screen keyboard shortcuts for chapter buttons:
  - `K` Κινηματική, `D` Δυναμική, `P` Περιστροφή, `E` Έργο & Ενέργεια, `T` Τύποι, `M` Τυχαίο
  - includes Greek key fallback (`κ,δ,π,ε,τ,μ`).
- Result-screen `Space` shortcut now triggers **Νέο Quiz**.

### Changed
- Added letter hints directly in chapter button labels (e.g. `K) Κινηματική`).

## [0.6.3] - 2026-03-05
### Changed
- Simplified `v-t` graph labels to avoid revealing the numeric answer directly.
- Kept only symbolic labels (`v₀`, `a`, `t`, `v(t)`) for cleaner exam-like visuals.

## [0.6.2] - 2026-03-05
### Fixed
- `v-t` graph now reflects each question's actual parameters (`v₀`, `a`, `t`), including negative slope cases (`a<0`).
- Added dynamic labels on graph (`v₀`, `t`, `v(t)`, `a`) for better correspondence with prompt text.

## [0.6.1] - 2026-03-05
### Fixed
- A/B/C/D keyboard answer shortcuts now work regardless of keyboard layout (uses physical key codes + Greek character fallback).

## [0.6.0] - 2026-03-05
### Changed
- Upgraded kinematics `v-t` graph visuals (dark chart card, grid lines, highlighted endpoints, and clearer axis/point labels) for better readability.

## [0.5.9] - 2026-03-05
### Fixed
- Added actual graph visuals to numeric kinematics graph questions (`v-t`) so "Γραφικά" prompts always display a chart.
- Removed elevator context from linear-kinematics word-problem pool to keep scenarios more natural.

## [0.5.8] - 2026-03-05
### Changed
- Replaced vague phrase "Στην ίδια κίνηση" with explicit problem-style circular-motion wording.
- Polished paired uniform-rotation prompts for consistency and clarity.

## [0.5.7] - 2026-03-05
### Added
- Keyboard answer shortcuts: pressing `A` / `B` / `C` / `D` selects the corresponding choice.
- Keeps existing `Space` shortcut for next question.

## [0.5.6] - 2026-03-05
### Changed
- Rewrote no-time train prompt to a more problem-like Greek wording.

### Added
- Added opposite-sign kinematics variant: `v<0, a>0` -> behavior of `|v|`.

## [0.5.5] - 2026-03-05
### Changed
- Stats panel now shows **Global max streak** independently from global-best score record, to avoid confusion when a high-score run has lower streak.

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
