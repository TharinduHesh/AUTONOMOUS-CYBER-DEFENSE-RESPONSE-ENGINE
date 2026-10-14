# PP1 Task Tracker — Autonomous Cyber Defense and Response Engine

**Project:** J26-CS-319  
**Researcher:** T. H. Ranasinghe — IT23269484  
**Last reviewed:** 14 October 2026  
**Scope:** Evidence correlation, dynamic risk assessment, response recommendations, and explainable audit logging.

This tracker describes the restored existing prototype. The fixes, new tests, helper scripts, schemas, and evaluation reports previously added in this chat were undone. They are **not completed project work**.

Your approximately 50% progress is your reported estimate. This tracker does not calculate an implementation percentage.

## How to use this tracker

- **Fully completed:** The specific task exists and meets its stated purpose. Verification limits are noted below.
- **Partially complete:** Some functionality exists, but a requirement or confirmed correction remains.
- **To be completed:** The requirement is missing, or completion evidence has not been provided.
- `[x]` means the specific task is complete. `[ ]` means work remains.
- Mark a task complete only after checking its acceptance condition and saving the evidence.

## Current status of the four objectives

| Feature | Current status | What you have completed | What remains |
| --- | --- | --- | --- |
| Evidence Correlation | Partially complete | Module input models, adapters, JSON file reading, rejection of differing supplied IDs, cross-source evidence summaries, and conflict detection. | Require both source IDs, validate missing security fields and types safely, check actual evidence age and timestamp consistency, and add file-integration tests. |
| Dynamic Risk Assessment | Partially complete | Configurable additive scoring, a 100-point cap, four risk categories, contribution breakdowns, and unit tests. | Fix decimal threshold gaps, explicitly handle missing evidence, justify weights and dependent indicators, and correct misleading correlation-boost explanations. |
| Risk-Based Response Selection | Partially complete | Priority-ordered decision rules, replay handling, response explanations, a classification-only baseline, and unit tests. | Apply authentication/integrity and conflict overrides consistently, account for evidence quality and backup availability, expose the selected rule ID, and exclude trend upgrades from the revised PP1 workflow. |
| Explainable Decision & Audit Logging | Partially complete | Reason chains, SQLite storage, full-response snapshots, incident retrieval endpoints, and risk history display. | Prevent record overwrites after restart, close database connections explicitly, retain original source references and response-rule IDs, clarify recommendation-only status, and verify persistence independently. |

## Fully completed tasks — keep the existing implementation

- [x] **C01 — Modular backend structure.** Models, adapters, configuration, services, and tests are separated into existing folders.
- [x] **C02 — FastAPI route implementation.** Evaluation, file upload, scenarios, incident retrieval, history, and status routes exist in `backend/main.py`. Full HTTP behavior is not yet comprehensively tested.
- [x] **C03 — Module input model definitions.** Existing RF, threat-intelligence, and communication models define supported data structures. Strict handling of absent fields remains a separate task.
- [x] **C04 — Risk calculation for existing covered scenarios.** Classification, severity, link, freshness, authentication, and integrity contribute to an explained score. Existing weights should be preserved unless a justified correction is needed.
- [x] **C05 — Configurable scoring values.** Weights and category ranges are in `backend/config/scoring_weights.py`.
- [x] **C06 — Ordered response-rule table.** Existing rules are defined in `backend/config/response_rules.py`; the first matching rule is selected.
- [x] **C07 — Existing conflict and confidence functions.** The currently covered conflict cases and confidence outputs are implemented and tested. Additional safety cases remain below.
- [x] **C08 — Human-readable explanations.** `backend/services/explanation_service.py` builds a decision reason chain.
- [x] **C09 — Basic SQLite logging and retrieval.** Incident snapshots can be stored and retrieved. Restart safety and connection cleanup remain below.
- [x] **C10 — Operator interface implementation.** The Evaluate page provides file selection, scenario inputs, risk results, recommendations, explanations, conflicts, and history.
- [x] **C11 — Existing automated test suite.** The 43 original tests passed during the baseline review in this chat.
- [x] **C12 — Frontend build.** TypeScript and Vite completed successfully during the baseline review. A bundle-size warning was reported.
- [x] **C13 — Basic setup documentation.** `README.md`, dependency requirements, and `start-prototype.ps1` exist. Their revised-scope instructions still need updating.

## Partially complete tasks — finish with focused corrections

### Priority 1 — Evidence correlation and validation

- [ ] **P01 — Require matching source observation IDs.** Currently Module 3 can omit its ID and use timestamp fallback. **Done when:** the PP1 workflow requires both IDs and never combines different observations. Relevant file: `backend/services/file_integration_service.py`.
- [ ] **P02 — Validate missing security fields safely.** Missing authentication, integrity, and freshness currently default to valid/fresh values. **Done when:** incomplete records return clear errors or explicit uncertainty; absent data never establishes trust.
- [ ] **P03 — Validate JSON value types and errors.** The replay value uses `bool(...)`, so the string `"false"` can become `True`; malformed container values can cause unexpected errors. **Done when:** wrong types consistently return understandable validation errors.
- [ ] **P04 — Check real evidence freshness.** Current checks do not compare evidence timestamps against a configurable maximum age. **Done when:** stale, future, timezone-inconsistent, and excessively skewed timestamps are handled explicitly.
- [ ] **P05 — Preserve measurement meaning.** Statistical deviation values are currently copied into RF measurement fields. **Done when:** deviation scores remain labelled as deviations and are not reported as measured RSSI/SNR.
- [ ] **P06 — Add correlation and file-input tests.** **Done when:** matched normal/jamming, mismatched IDs, missing fields, invalid JSON, contradictory evidence, and stale evidence have automated tests.

### Priority 2 — Risk assessment

- [ ] **P07 — Fix risk-category boundary gaps.** A reproduced check classified `24.95` as CRITICAL because the configured ranges have gaps. **Done when:** decimal scores around 25, 50, and 75 map continuously to the correct categories.
- [ ] **P08 — Represent missing evidence explicitly.** Default-filled inputs can appear normal/trusted. **Done when:** unavailable evidence is identified, its scoring treatment is documented, and conservative behavior is tested.
- [ ] **P09 — Explain the weight choices.** **Done when:** the existing scoring formula, weight rationale, category thresholds, calibration limitations, and treatment of dependent indicators are documented. Do not claim experimentally validated weights.
- [ ] **P10 — Correct correlation-boost claims.** Correlation produces an alignment boost value, but the risk scorer does not add it; the explanation/UI can say it was applied. **Done when:** the displayed contribution matches the calculation. Preserve the formula unless a change is explicitly justified.

### Priority 3 — Response selection and scope

- [ ] **P11 — Add authentication/integrity safety overrides.** A reproduced check returned MONITOR for normal RF with suspicious authentication. **Done when:** suspicious or invalid security evidence cannot produce an unjustified normal recommendation.
- [ ] **P12 — Respect the conflict result.** The response function accepts a conflict flag but does not use it; a reproduced conflict case still recommended backup preparation. **Done when:** the policy handles conflicts explicitly and overlapping-rule priority is tested.
- [ ] **P13 — Handle stale and missing evidence conservatively.** **Done when:** incomplete or outdated evidence leads to a justified security-preserving recommendation or operator review.
- [ ] **P14 — Check backup availability.** **Done when:** backup use is recommended only with explicit availability and appropriate trust/security evidence. Unknown availability must not be assumed true.
- [ ] **P15 — Record the selected response rule.** **Done when:** a stable response-rule ID appears in the output, explanation, and stored audit record. Distinguish it from the upstream AI classification rule.
- [ ] **P16 — Provide a bounded PP1 workflow.** Current pipeline decisions use rolling-history trend upgrades. **Done when:** the revised workflow produces repeatable recommendations without forecasting, trend upgrades, execution, or feedback loops; existing legacy functionality remains intact where compatible.
- [ ] **P17 — Clarify recommendation-only output.** Current output says `SIMULATED`. **Done when:** PP1 results clearly state `RECOMMENDED_ONLY` or an equally precise status and make no claim of UAV action execution.

### Priority 4 — Logging and operator feedback

- [ ] **P18 — Prevent audit overwrites after restart.** IDs restart from `INC-0001`, and `INSERT OR REPLACE` can replace an earlier decision. This was reproduced using a temporary database. **Done when:** IDs remain unique across restarts and simultaneous requests, and previous records stay intact.
- [ ] **P19 — Close SQLite connections.** Connection context managers commit transactions but do not themselves close connections; a temporary database stayed locked during the attempted evaluation. **Done when:** database handles are released and Windows persistence/cleanup checks pass.
- [ ] **P20 — Retain source evidence references.** File metadata currently stores filenames rather than full original evidence references. **Done when:** the audit preserves source IDs/timestamps, original evidence or suitable references, decision-rule ID, score, response, and explanation.
- [ ] **P21 — Initialize the CLI audit database.** `backend/process_json_files.py` does not initialize its database before saving. **Done when:** processing valid files succeeds on a clean setup and writes a retrievable audit record.
- [ ] **P22 — Show upload and processing errors clearly.** Upload validation failures currently use a successful HTTP response; some UI errors are only logged or silently ignored. **Done when:** failures have appropriate error status and visible messages, with no stale success result displayed.
- [ ] **P23 — Inspect complete saved decisions in the UI.** The current page shows risk history; incident-detail APIs already exist. **Done when:** an operator can view persisted evidence, rule ID, and explanation without relying on the last in-memory result.
- [ ] **P24 — Protect manual audit clearing.** The reset endpoint clears stored decisions. **Done when:** the UI explains and confirms permanent clearing, and automated tests use temporary databases rather than the normal audit database.

## To be completed — missing deliverables or unverified evidence

- [ ] **T01 — Valid and invalid JSON example files.** Provide reusable matched pairs and invalid/mismatched cases. Explain how to refresh timestamps for a live demonstration.
- [ ] **T02 — Published data contracts.** Document or export input, correlated incident, risk, response, and audit formats. Separate strict PP1 requirements from any preserved legacy format.
- [ ] **T03 — Reproducible test environment.** Document pytest installation and safe commands. Keep tests away from `backend/database/incidents.db`.
- [ ] **T04 — Saved test results.** Run the completed suite and save genuine results. The undone 91/92-test changes and their reports are not present in the restored project.
- [ ] **T05 — Synthetic evaluation dataset.** Cover normal, jamming, unknown RF, trusted/degraded/untrusted communication, suspicious authentication, missing data, and conflicting evidence. Write expected behavior before running it.
- [ ] **T06 — Evaluation metrics.** Measure correlation correctness, reference-policy risk agreement, response correctness, benign false escalation, decision latency, and audit completeness. Report dataset size and limitations.
- [ ] **T07 — Independently reviewed reference policy.** Obtain supervisor or domain-review feedback before claiming independent risk-category agreement. Internally chosen expected outputs alone do not establish independent validation.
- [ ] **T08 — Baseline comparison evidence.** Use the existing classification-only baseline and explain specific decision differences. Do not claim improved accuracy without appropriate tests.
- [ ] **T09 — Teammate interface confirmation.** Confirm real Module 2/Module 3 fields, IDs, timestamps, enumerations, and backup availability with their owners. Actual teammate interoperability has not been verified here.
- [ ] **T10 — Revised README and scope documentation.** Document the four objectives, component ownership, installation, run commands, audit inspection, limitations, and the PP1 demonstration route.
- [ ] **T11 — Demonstrate two meaningful functions.** Prepare a repeatable input → correlation → risk → recommendation → saved-record demonstration using genuine backend processing.
- [ ] **T12 — PP1 implementation evidence.** Collect representative inputs/outputs, saved audit records, module references, test results, and demonstration screenshots or recordings.
- [ ] **T13 — GitHub development evidence.** Confirm commits and individual contribution history. Remote activity was not checked, so this is evidence to verify rather than an assertion that no commits exist.
- [ ] **T14 — MS Planner task evidence.** Add or confirm tasks, priorities, and completion evidence. Planner was not inspected.
- [ ] **T15 — Research diary and supervisor feedback.** Add or confirm dated implementation entries and feedback. These records were not provided for review.
- [ ] **T16 — Final PP1 readiness review.** Clearly distinguish completed/tested, partially implemented, planned after PP1, and removed objectives. Agree any remaining limitations with your supervisor.

## Removed objectives — exclude from PP1 completion targets

Existing legacy forecasting and response simulation are present. Preserve them unless a confirmed conflict requires a small correction; do not extend them for PP1.

- Future threat forecasting and time-series prediction.
- Real UAV response execution or flight-control commands.
- Actual frequency or communication-channel switching.
- Autonomous flight manipulation.
- Reinforcement learning, model training, or automatic policy adaptation.
- Response-success feedback loops.

The engine recommends a response. The owning communication module/operator is responsible for any real communication action.

## Recommended completion sequence

1. Complete **P01–P06** so the engine receives trustworthy, correctly matched evidence.
2. Complete **P07–P10** while preserving correct existing scoring behavior.
3. Complete **P11–P17** to make PP1 decisions safe, repeatable, and recommendation-only.
4. Complete **P18–P24** to preserve audit evidence and make results/errors inspectable.
5. Complete **T01–T12**, then verify external assessment evidence in **T13–T16**.

## Verification record

- **Baseline backend:** 43 original tests passed in this chat, using a temporary database to protect saved records.
- **Baseline frontend:** TypeScript/Vite build passed; bundle-size warning remained.
- **Confirmed baseline bugs:** Decimal category gap, ignored conflict flag, suspicious-authentication MONITOR result, and audit overwrite after counter reset were reproduced separately.
- **Not verified:** Full browser interaction, real teammate interfaces, real RF/UAV operation, independent policy calibration, GitHub/Planner/diary evidence, or institutional confirmation of PP1 readiness.
- **Current edit:** This tracker only. No application code changes are included in this task.

## Completion entry template

Copy this entry when completing a task:

```text
Task ID:
Status: Fully completed / Partially complete / To be completed
Date:
What changed:
Files changed:
Test or check performed:
Actual result:
Evidence location:
Remaining limitation:
```
