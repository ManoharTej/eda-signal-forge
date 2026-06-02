# Signal Forge: Technical Project Analysis

Signal Forge is a forensic-grade computational workstation for Electrodermal Activity (EDA) signal processing. This document provides an engineering-level breakdown of the codebase architecture, design choices, and mathematical subsystems.

---

## 1. Project Overview

In biometric research, Electrodermal Activity (EDA) — also known as Galvanic Skin Response (GSR) — is the most direct physiological indicator of sympathetic nervous system arousal. However, raw EDA data captured from wearable sensors is highly susceptible to mechanical noise, electrode movement, temperature drift, and pressure anomalies.

Signal Forge solves this **"Noise-to-Signal Paradox"** by providing:
- An **Unsupervised Machine Learning Sandbox** that allows researchers to analyze and compare multiple cleaning algorithms.
- An **Ensemble Majority Voting Engine** that combines mathematical models for consensus-based artifact healing.
- A **Forensic Auditor API** that scores reconstructions based on physical and statistical constraints (Shannon Entropy, Tonic Fidelity, Healing Precision).
- A **Real-Time Visualization Suite** supporting both standard 2D and interactive 3D WebGL (React Three Fiber) signal plotting.

---

## 2. Directory & Code Structure

The repository is organized into three distinct operational layers:

```text
eda-signal-forge/
├── python_backend/           # Neural Processing Core (FastAPI & ML)
│   ├── main.py               # REST API endpoints & route logic
│   ├── ml_engine.py          # Core ML Engine, formulas, and 7 algorithm implementations
│   ├── requirements.txt      # Backend Python dependencies
│   └── telemetry_database.csv# Persistent telemetry log vault
├── eda-insight/              # Workstation Cluster (Next.js 14 Frontend)
│   ├── src/
│   │   ├── app/              # Next.js App Router (pages: forge, monitor, settings, history)
│   │   ├── components/       # Clinical Glassmorphism reusable components
│   │   ├── context/          # State management (Auth, Theme)
│   │   └── lib/              # Firebase API setup and database connectors
│   ├── package.json          # Node dependencies & dev scripts
│   └── tailwind.config.js    # Tailwind styling tokens
└── subject-mobile/           # Subject Node (Expo / React Native Client)
    ├── app/                  # App screen routing
    ├── components/           # Custom SVG waves, buttons, and haptic feedback
    └── package.json          # Mobile node dependencies
```

### 2.1 The Backend (Python & FastAPI)
- [main.py](file:///c:/Users/manoh/Downloads/eda-signal-forge-master/eda-signal-forge-master/python_backend/main.py): Sets up ASGI middleware, handling CORS policies, and exposes key endpoints:
  - `/analyze`: Accepts a raw array, a mode (`solo` or `hybrid`), and selected techniques. Dispatches requests to the ML engine and returns corrected data alongside quality metrics.
  - `/benchmark`: Computes the brute-force combinations of all 127 possible algorithm subsets and returns their sorted rankings.
  - `/log_telemetry`: Appends extracted 13-attribute windows directly to physical storage.
- [ml_engine.py](file:///c:/Users/manoh/Downloads/eda-signal-forge-master/eda-signal-forge-master/python_backend/ml_engine.py): Houses the class `ForensicMLEngine`. Contains raw vector math (NumPy, SciPy) and scikit-learn models.

### 2.2 The Frontend (Next.js 14)
- Exposes a glassmorphic dashboard styled with Tailwind CSS.
- Integrates GSAP for spring-based component transitions and 3D card tilt effects.
- Utilizes `@react-three/fiber` and `@react-three/drei` to render 3D scatter plots of multi-attribute biosensors.

### 2.3 The Mobile Client (Expo)
- Represents the edge ingestion node. Operates in two modes: physical sensor ingestion (via BLE) and high-fidelity mathematical simulation (modeling GSR changes using capacitive touch pressure).

---

## 3. Core Technical Decisions

### 3.1 Unsupervised Machine Learning Sandbox
Rather than relying on fixed threshold filtering (which often clips legitimate emotional spikes or misses complex movement artifacts), Signal Forge implements seven distinct unsupervised algorithms:
1. **CUL-v4 (Contrastive Unsupervised Learning)**: Compares sliding window distributions against an adaptive tonic baseline anchor.
2. **GMM (Gaussian Mixture Models)**: Separates the biometric trace into components representing resting state, aroused state, and motion noise.
3. **K-Means**: Clusters sample clusters to find the true centroid baseline.
4. **DBSCAN**: Density-based spatial clustering that separates sharp artifact spikes (outliers) from smooth, slow-moving biological signals.
5. **Isolation Forest**: Isolates anomalies by partitioning features using random decision trees.
6. **Local Outlier Factor (LOF)**: Compares local density of points against neighbors to flag sudden shifts.
7. **PCA (Principal Component Analysis)**: Projects signal variances to extract the primary autonomic signal trend.

### 3.2 Ensemble Majority Voting
In "Hybrid Mode," the system processes data through all selected models in parallel. It uses a **Majority Voting Consensus** to determine if a point is an artifact. 
$$\text{Is\_Artifact}(x_i) = \sum_{m \in M} \mathbb{I}(\text{Model}_m(x_i) = \text{Anomaly}) \ge \left\lfloor \frac{|M|}{2} \right\rfloor + 1$$
If the majority of models flag the sample, the system initiates **piecewise linear bridge interpolation** from the nearest clean boundaries (Lajante et al., 2012), preventing artificial flatline shapes.

### 3.3 Three-Axis Differentiating Score System
To prevent models from "gaming" the rankings, the **Forensic Auditor** rates every reconstruction based on three physiological factors:
1. **Tonic Fidelity (40%)**: Measures how close the healed points are to the expected baseline (median of clean points).
2. **Healing Precision (35%)**: Evaluates whether the model modified ONLY actual artifacts, penalizing models that over-clean normal emotional responses.
3. **SNR Improvement (25%)**: Calculates the post-filtered Signal-to-Noise Ratio (power of signal variance versus artifact noise power).

The final composite score is calculated as:
$$\text{Score} = (\text{Tonic Fidelity} \times 0.40) + (\text{Precision} \times 0.35) + (\text{SNR Improvement} \times 0.25)$$

---

## 4. Architectural Data Schema

Biometric logs are stored in a high-density, flat append-only CSV structure to avoid database transaction locks during high-frequency streaming:

| Column | Attribute | Type | Description |
| :--- | :--- | :--- | :--- |
| 1 | `User_ID` | String | Unique anonymized subject key |
| 2 | `Age` | Integer | Subject age for normalization |
| 3 | `Gen` | String | Biological gender metadata |
| 4 | `BSR` | Float | Basal Skin Resistance ($R = 1/\text{Conductance}$) |
| 5 | `Win` | Integer | 5-second epoch window index |
| 6 | `EDA_Mean`| Float | Tonic average of raw window (μS) |
| 7 | `EDA_Std` | Float | Standard Deviation (Noise index) |
| 8 | `SCL_Tonic`| Float | Refined baseline conductance level |
| 9 | `SCR_Peaks`| Integer | Count of Sympathetic Skin Conductance Spikes |
| 10| `SCR_Amp`  | Float | Peak-to-peak amplitude in window |
| 11| `Slope_Max`| Float | Maximum rate of change of conductance |
| 12| `Entropy`  | Float | Shannon Entropy score (chaos index) |
| 13| `Motion`   | Integer | Binary flag (0 = Nominal, 1 = Disturbance) |

This decoupling ensures compliance with medical data privacy guidelines by keeping Personal Identifiable Information (PII) in an encrypted local JSON passport, linked only via the `User_ID`.
