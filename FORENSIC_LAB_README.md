# Signal Forge: Forensic ML Research Lab

## 1. Project Vision
Signal Forge is an advanced biometric workstation designed to decode human autonomic responses through Electrodermal Activity (EDA). The core innovation is the **Algorithm Sandbox**, which allows researchers to test and compare multiple Unsupervised Machine Learning techniques in real-time.

## 2. Integrated Unsupervised Techniques
The station supports seven different mathematical approaches:
*   **CUL-v4 (Contrastive Unsupervised Learning)**: Detects anomalies by contrasting current windows against historical anchors.
*   **GMM (Gaussian Mixture Model)**: Uses probabilistic clustering to separate bio-signal 'clouds' from noise 'clouds'.
*   **K-Means**: The industry-standard centroid clustering baseline.
*   **DBSCAN**: Density-based clustering that identifies complex, non-linear noise patterns.
*   **Isolation Forest**: High-speed tree-based outlier detection for motion spikes.
*   **LOF (Local Outlier Factor)**: Neighbor-based detection that understands temporal trends.
*   **PCA (Principal Component Analysis)**: Identifies shifts in signal energy variance.

## 3. Hybrid Ensemble Logic (The Voting Engine)
Researchers can activate 'Hybrid Mode', which runs multiple algorithms in parallel. The workstation uses a **Majority Voting Consensus** to reconstruct the signal. If a majority of selected models identify a point as noise, forensic healing is initiated.

## 4. The Forensic Auditor (AI Bot)
The system includes an integrated Auditor that evaluates every trial run based on three critical forensic metrics:
1.  **Smoothness Index**: Measures the biological naturalism of the reconstructed wave.
2.  **Suppression Ratio**: Tracks the efficiency of artifact removal.
3.  **Stability Index**: Uses Shannon Entropy to ensure signal integrity.

The Auditor maintains a 'Trial History' and proactively suggests the most reliable model configuration for the specific subject data being analyzed.
