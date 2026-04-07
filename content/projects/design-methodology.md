---
title: "Engineering Design Methodology"
date: "2025-01-12"
description: "Our systematic approach to engineering design, from problem identification to solution identification."
technical: "SolidWorks, MATLAB, ANSYS, FMEA Analysis."
tags: ["Methodology", "Design", "Quality"]
---
<p><img
        src="/api/og?title=Engineering Design Methodology&description=Our systematic approach to engineering design, from problem identification to solution implementation.&type=workflow"/>
</p>


## Design Process Overview

We follow a structured engineering design methodology adapted from industry best practices:

```
Problem Identification → Research → Conceptual Design → 
Detailed Design → Prototyping → Testing → Refinement → Implementation
```

## Phase 1: Problem Identification

**Objective:** Clearly define the problem we're solving

**Activities:**
- Stakeholder interviews (farmers, municipal workers, industry experts)
- Site visits and observations
- Data collection on current solutions
- Problem statement formulation

**Deliverables:**
- Problem statement document
- Requirements specification
- Success criteria definition

## Phase 2: Research & Analysis

**Literature Review:**
- Academic papers and journals
- Industry reports
- Patent searches
- Existing solutions analysis

**Technical Research:**
- Material properties and availability
- Component specifications
- Cost analysis
- Regulatory requirements

**Tools Used:**
- Google Scholar, IEEE Xplore
- Sri Lanka Standards Institution (SLSI) guidelines
- Local supplier catalogs

## Phase 3: Conceptual Design

**Brainstorming Techniques:**
- Mind mapping
- SCAMPER method
- Morphological analysis

**Concept Evaluation:**

We use a weighted decision matrix:

$$
S_i = \sum_{j=1}^{n} w_j \times r_{ij}
$$

Where:
- $S_i$ = Total score for concept $i$
- $w_j$ = Weight of criterion $j$
- $r_{ij}$ = Rating of concept $i$ for criterion $j$

**Evaluation Criteria:**
- Technical feasibility (weight: $0.25$)
- Cost effectiveness (weight: $0.20$)
- Environmental impact (weight: $0.15$)
- Ease of implementation (weight: $0.20$)
- Scalability (weight: $0.20$)

## Phase 4: Detailed Design

**CAD Modeling:**
- SolidWorks for mechanical components
- Fusion 360 for assemblies
- AutoCAD for 2D drawings

**Engineering Analysis:**

**Stress Analysis:**
For structural components, we verify:

$$
\sigma_{max} \lt \frac{\sigma_{yield}}{SF}
$$

Where $SF$ = Safety Factor (typically 2-3 for static loads)

**Thermal Analysis:**
For electronic systems:

$$
T_{junction} = T_{ambient} + P_{dissipated} \times R_{thermal}
$$

**Simulation Tools:**
- ANSYS for FEA
- MATLAB/Simulink for control systems
- LTSpice for circuit simulation

## Phase 5: Prototyping

**Rapid Prototyping:**
- 3D printing for plastic parts
- Laser cutting for sheet metal
- CNC machining for precision components

**Electronics Prototyping:**
- Breadboard testing
- PCB design (KiCAD)
- Arduino/Raspberry Pi for control

**Documentation:**
- Bill of Materials (BOM)
- Assembly instructions
- Wiring diagrams

## Phase 6: Testing & Validation

**Test Plan Development:**

For each requirement, we define:
- Test procedure
- Acceptance criteria
- Measurement method
- Number of trials

**Example Test Case:**

```
Test ID: TC-001
Requirement: System shall operate continuously for 8 hours
Procedure: 
  1. Fully charge/fuel system
  2. Run at nominal load
  3. Monitor for failures
  4. Record runtime
Acceptance: Runtime ≥ 8 hours
Trials: 5 repetitions
```


**Data Collection:**
- Sensor measurements
- Performance metrics
- Failure modes
- User feedback

## Phase 7: Refinement

**Failure Mode Analysis:**

We use FMEA (Failure Mode and Effects Analysis):

$$
RPN = Severity \times Occurrence \times Detection
$$

Where RPN = Risk Priority Number (1-1000)

**Iterative Improvement:**
- Address high-RPN failure modes first
- Optimize based on test results
- Cost reduction without compromising quality

## Phase 8: Implementation

**Deployment Planning:**
- Installation procedures
- User training materials
- Maintenance schedules
- Spare parts inventory

**Documentation:**
- User manual
- Technical specifications
- Maintenance guide
- Troubleshooting procedures

## Tools & Software

| Category | Tools |
|----------|-------|
| CAD | SolidWorks, Fusion 360, AutoCAD |
| Simulation | ANSYS, MATLAB, LTSpice |
| Programming | Python, C/C++, Arduino IDE |
| PCB Design | KiCAD, EasyEDA |
| Documentation | LaTeX, Markdown, Notion |
| Version Control | Git, GitHub |
| Project Management | Trello, Gantt charts |

## Quality Standards

We adhere to:
- ISO 9001 (Quality Management)
- ISO 14001 (Environmental Management)
- SLSI standards (where applicable)
- IEEE standards for electronics

## Safety Considerations

All designs must:
- Include appropriate safety guards
- Have emergency stop mechanisms
- Use proper electrical isolation
- Comply with local safety regulations
- Include warning labels and instructions

## Cost Management

**Budget Tracking:**
- Maintain detailed expense log
- Compare actual vs. estimated costs
- Identify cost-saving opportunities
- Justify any budget overruns

**Cost Optimization:**
- Use locally available materials when possible
- Consider manufacturing scalability
- Evaluate make vs. buy decisions
- Negotiate with suppliers

## Sustainability

We consider:
- Material recyclability
- Energy efficiency
- Product lifetime
- End-of-life disposal
- Carbon footprint

## Collaboration Tools

- **Communication**: WhatsApp group, weekly meetings
- **File Sharing**: Google Drive, GitHub
- **Documentation**: Shared Notion workspace
- **Design Reviews**: Weekly presentations to supervisor
