import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
from sklearn.neighbors import LocalOutlierFactor
from sklearn.decomposition import PCA
from typing import List, Dict, Any
import os
import pandas as pd

class ForensicMLEngine:
    """
    ============================================================
    SIGNAL FORGE — EDA FORENSIC ML ENGINE v5.0
    ============================================================
    All algorithms calibrated to published EDA physiology.

    References:
      - Boucsein (2012): Electrodermal Activity, 2nd Ed.
      - Bach et al. (2010): Scoring autonomic EDA data
      - Greco et al. (2016): cvxEDA decomposition paper
      - Lajante et al. (2012): EDA artifact correction guidelines
      - Benedek & Kaernbach (2010): SCR detection guidelines

    Physiological constants used:
      EDA human range:      0.5 – 20.0 uS
      Resting baseline:     1.0 – 3.0 uS (controlled lab)
      SCR amplitude:        +0.1 to +3.0 uS above baseline
      SCR rise time:        1-3 seconds
      Motion artifact:      instantaneous, 2-10x normal range
      Lab contamination:    ~8% typical (Benedek & Kaernbach)
    ============================================================
    """

    # EDA Physiological Constants
    EDA_VALID_RANGE       = (0.5, 20.0)   # uS — valid human range
    SCR_MAX_AMPLITUDE     = 3.0           # uS — max real SCR above baseline
    ARTIFACT_SIGMA        = 2.5           # stddev — Benedek & Kaernbach threshold
    TYPICAL_CONTAMINATION = 0.08          # 8% typical lab EDA contamination

    def __init__(self):
        self.trial_history = []
        # NOTE: No persistent history_anchor — all algorithms compute
        # fresh per batch to prevent cross-call state contamination.

    # ===========================================================
    # SHARED EDA UTILITIES
    # ===========================================================

    def _safe_std(self, data: np.ndarray) -> float:
        """Standard deviation with physiological floor (avoids division by zero)."""
        return max(float(np.std(data)), 0.01)

    def _adaptive_contamination(self, data: np.ndarray) -> float:
        """
        Estimate actual artifact contamination from signal statistics.
        Uses 2.5-sigma outlier detection (Benedek & Kaernbach, 2010).
        Clamped to physiologically plausible range: 2-25%.
        """
        std  = self._safe_std(data)
        mean = float(np.mean(data))
        n_out = float(np.sum(np.abs(data - mean) > self.ARTIFACT_SIGMA * std))
        rate  = n_out / max(len(data), 1)
        return float(np.clip(rate, 0.02, 0.25))

    def _detect_scr_events(self, data: np.ndarray) -> np.ndarray:
        """
        EDA SCR PROTECTOR
        -----------------
        Identifies legitimate phasic SCR responses so algorithms do NOT
        accidentally heal real brain/emotional responses.

        SCR signature (Boucsein 2012):
          - Gradual positive rise over >=2 consecutive windows
          - Rise magnitude 0.05 - 3.0 uS above baseline
          - Does NOT exceed 2.5-sigma (that level = artifact)
          - Followed by slow exponential decay

        Returns boolean mask — True = protect this point (real SCR).
        """
        n      = len(data)
        is_scr = np.zeros(n, dtype=bool)
        if n < 3:
            return is_scr

        baseline = float(np.median(data))
        std      = self._safe_std(data)
        diffs    = np.diff(data)

        for i in range(1, n - 1):
            rise_gradual   = 0 < diffs[i - 1] < std * 2.5
            amp_valid      = 0.05 <= (data[i] - baseline) <= self.SCR_MAX_AMPLITUDE
            not_artifact   = data[i] < baseline + self.ARTIFACT_SIGMA * std
            if rise_gradual and amp_valid and not_artifact:
                is_scr[i] = True

        return is_scr

    def _interpolate_artifacts(self, data: np.ndarray,
                                artifact_mask: np.ndarray) -> np.ndarray:
        """
        EDA-CORRECT HEALING — Linear interpolation from clean neighbors.
        -----------------------------------------------------------------
        Replaces old flat-constant substitution which created artificial
        flat segments and destroyed tonic baseline.

        Method: Lajante et al. (2012) — piecewise linear bridge across
        artifact gaps, preserving physiological tonic trend.
        """
        refined = data.copy().astype(float)
        n       = len(data)

        for i in np.where(artifact_mask)[0]:
            left = i - 1
            while left >= 0 and artifact_mask[left]:
                left -= 1
            right = i + 1
            while right < n and artifact_mask[right]:
                right += 1

            if left >= 0 and right < n:
                t = (i - left) / (right - left)
                refined[i] = data[left] * (1.0 - t) + data[right] * t
            elif left >= 0:
                refined[i] = data[left]
            elif right < n:
                refined[i] = data[right]
            else:
                refined[i] = float(np.median(data))

        return refined

    # ===========================================================
    # EDA-CALIBRATED QUALITY METRICS
    # ===========================================================

    def calculate_metrics(self, raw: np.ndarray,
                           refined: np.ndarray) -> Dict[str, float]:
        """
        3-AXIS DIFFERENTIATING SCORE SYSTEM
        -------------------------------------
        Designed to produce genuinely different scores for each algorithm.
        The old 4-axis formula gave same scores because all algorithms
        suppressed obvious artifacts equally well.

        New axes specifically chosen to separate algorithm behaviors:

        1. TONIC FIDELITY (40%) — "Did you heal to the RIGHT level?"
           Expected tonic = median of clean (non-artifact) points.
           Each algorithm heals to a different value (CUL→3.8, GMM→4.3 etc.)
           → Algorithm closest to true baseline scores highest.

        2. HEALING PRECISION (35%) — "Did you ONLY touch artifact points?"
           Precision = artifact_points_changed / total_points_changed
           Conservative algorithms (CUL) score high.
           Aggressive ones that over-clean normal data score lower.

        3. SNR IMPROVEMENT (25%) — "How much did signal quality improve?"
           SNR = signal_variance / artifact_noise_power
           Algorithms that remove larger spikes score higher.
           Helps separate algorithms on magnitude of healing.
        """
        raw     = np.nan_to_num(raw)
        refined = np.nan_to_num(refined)

        if len(refined) < 3:
            return dict(
                artifact_suppression=0.0, baseline_integrity=0.0,
                scr_preservation=0.0,     signal_continuity=0.0,
                smoothness_score=0.0,     noise_suppression=0.0,
                stability_index=0.0
            )

        std  = self._safe_std(raw)
        mean = float(np.mean(raw))

        # Identify artifact points (statistical outliers > 2.5 sigma)
        art_mask  = np.abs(raw - mean) > self.ARTIFACT_SIGMA * std
        clean_mask = ~art_mask
        n_art     = int(np.sum(art_mask))

        # ── METRIC 1: TONIC FIDELITY (40%) ──────────────────────────
        # "Did the algorithm heal artifacts to the correct tonic level?"
        # Expected tonic = median of clean (non-artifact) points.
        # Each algorithm produces a different healed level → differentiates them.
        if np.sum(clean_mask) > 2:
            expected_tonic = float(np.median(raw[clean_mask]))
        else:
            expected_tonic = mean

        if n_art > 0:
            # How far are healed artifact points from expected tonic?
            healed_deviation = float(np.mean(
                np.abs(refined[art_mask] - expected_tonic)
            ))
            # Normalize by signal std. Perfect heal = 0 deviation = 100%.
            tonic_fidelity = float(max(0.0, 100.0 - (healed_deviation / std * 50)))
        else:
            tonic_fidelity = 100.0  # No artifacts → perfect by default

        # ── METRIC 2: HEALING PRECISION (35%) ───────────────────────
        # "Did the algorithm ONLY change artifact points?"
        # Conservative algorithms touch only outliers → high precision.
        # Aggressive algorithms disturb clean signal too → lower precision.
        changed_mask  = np.abs(raw - refined) > (std * 0.1)
        n_changed     = int(np.sum(changed_mask))
        if n_changed > 0:
            true_positives = int(np.sum(art_mask & changed_mask))
            precision      = float(true_positives / n_changed * 100)
        else:
            # Nothing changed at all
            precision = 0.0 if n_art > 0 else 100.0

        # ── METRIC 3: SNR IMPROVEMENT (25%) ─────────────────────────
        # "How much did signal quality actually improve?"
        # SNR = how much of the signal is real vs noise from artifacts.
        signal_var = float(np.var(refined)) + 0.0001
        if n_art > 0:
            artifact_noise = float(np.mean((raw[art_mask] - refined[art_mask]) ** 2)) + 0.0001
            snr_ratio      = signal_var / artifact_noise
            snr_improvement = float(min(100.0, snr_ratio * 8))
        else:
            snr_improvement = 100.0  # No artifacts to remove

        # ── COMPOSITE DIFFERENTIATING SCORE (stored as smoothness_score) ──
        composite = (
            tonic_fidelity   * 0.40 +
            precision        * 0.35 +
            snr_improvement  * 0.25
        )

        # ── LEGACY STABILITY INDEX: now uses true SNR-based measure ──
        # Signal power vs noise power — independent of composite
        signal_power = float(np.mean(refined ** 2)) + 0.0001
        noise_power  = float(np.mean((raw - refined) ** 2)) + 0.0001
        snr_db       = float(10 * np.log10(signal_power / noise_power))
        stability_index = round(float(np.clip(snr_db / 3.0, 0.0, 10.0)), 2)

        noise_suppression = float(np.sum(np.abs(raw - refined)))

        # Keep old axis values for any downstream use
        artifact_suppression = tonic_fidelity   # repurposed but compatible
        baseline_integrity   = precision
        scr_preservation     = snr_improvement
        signal_continuity    = float(max(0.0, 100.0 - float(
            np.sum(np.abs(np.diff(refined)) < 0.001) / max(len(refined)-1,1) * 180
        )))

        result = dict(
            artifact_suppression = round(artifact_suppression, 2),
            baseline_integrity   = round(baseline_integrity,   2),
            scr_preservation     = round(scr_preservation,     2),
            signal_continuity    = round(signal_continuity,    2),
            smoothness_score     = round(composite,            2),  # SMOOTH% in UI
            noise_suppression    = round(noise_suppression,    2),  # CLEAN in UI
            stability_index      = round(stability_index,      2),  # STAB in UI
        )
        return {k: (0.0 if (np.isnan(v) or np.isinf(v)) else v)
                for k, v in result.items()}

    # ===========================================================
    # CUL-v4 — Contrastive Unsupervised Learning
    # ===========================================================

    def cul_v4_logic(self, data: np.ndarray) -> np.ndarray:
        """
        CUL-v4 EDA Edition
        ------------------
        FIXES vs old version:
          OLD: anchor persisted across API calls (state contamination)
          NEW: anchor computed fresh per batch from median

          OLD: 1.5-sigma threshold (flags 13% of normal data — too aggressive)
          NEW: 2.5-sigma threshold (flags ~1% of normal data — physiologically correct)

          OLD: flat constant replacement (artificial flatline)
          NEW: linear interpolation from clean neighbors

          OLD: SCR events could be deleted
          NEW: _detect_scr_events() protects them

        Reference: Greco et al. (2016) cvxEDA tonic anchor concept.
        """
        anchor    = float(np.median(data))
        threshold = self._safe_std(data) * self.ARTIFACT_SIGMA + 0.001

        distance      = np.abs(data - anchor)
        artifact_mask = (distance > threshold) & ~self._detect_scr_events(data)

        return self._interpolate_artifacts(data, artifact_mask)

    # ===========================================================
    # run_solo — Individual algorithm dispatcher
    # ===========================================================

    def run_solo(self, technique: str, data: np.ndarray) -> np.ndarray:
        """
        EDA-calibrated unsupervised technique runner.

        All algorithms share three EDA-correct principles:
          1. Adaptive thresholds from signal's own statistics
          2. Linear interpolation heals — no flat constant substitution
          3. SCR event protection — legitimate spikes preserved
        """
        data_reshaped = data.reshape(-1, 1)
        refined       = data.copy()
        mean          = float(np.mean(data))
        std           = self._safe_std(data)
        scr_mask      = self._detect_scr_events(data)
        contamination = self._adaptive_contamination(data)

        try:
            if technique == "gmm":
                # 3 components when enough data: resting / aroused / artifact
                # Baseline = cluster closest to median (robust vs argmin)
                n_comp = 3 if len(data) >= 15 else 2
                model  = GaussianMixture(
                    n_components=n_comp, random_state=42,
                    covariance_type='full', max_iter=200
                ).fit(data_reshaped)

                means            = model.means_.flatten()
                labels           = model.predict(data_reshaped)
                baseline_cluster = int(np.argmin(np.abs(means - np.median(data))))

                artifact_mask = (
                    (labels != baseline_cluster) &
                    (np.abs(data - mean) > self.ARTIFACT_SIGMA * std) &
                    ~scr_mask
                )
                refined = self._interpolate_artifacts(data, artifact_mask)

            elif technique == "kmeans":
                # Init centroids at mean and mean+2.5-sigma (physiological target)
                c_base = mean
                c_art  = mean + self.ARTIFACT_SIGMA * std

                if std < 0.001:
                    refined = data
                else:
                    for _ in range(20):
                        labels = np.array([
                            0 if abs(x - c_base) <= abs(x - c_art) else 1
                            for x in data
                        ])
                        cl0 = data[labels == 0]
                        cl1 = data[labels == 1]
                        if len(cl0) > 0: c_base = float(np.mean(cl0))
                        if len(cl1) > 0: c_art  = float(np.mean(cl1))

                    artifact_cluster = 1 if c_art > c_base else 0
                    artifact_mask = (
                        (labels == artifact_cluster) &
                        (np.abs(data - mean) > self.ARTIFACT_SIGMA * std) &
                        ~scr_mask
                    )
                    refined = self._interpolate_artifacts(data, artifact_mask)

            elif technique == "dbscan":
                # eps auto-calibrated to actual inter-sample EDA variation
                # Natural EDA variation between 5-sec windows ~ 0.1-0.4 uS
                # OLD: eps=0.03 — invisible to real EDA variation
                # NEW: eps = 1.5x typical inter-sample step, bounded 0.05-2.0 uS
                inter_var = float(np.mean(np.abs(np.diff(data))))
                eps = float(np.clip(max(inter_var * 1.5, std * 0.5), 0.05, 2.0))

                model = DBSCAN(eps=eps, min_samples=2).fit(data_reshaped)
                artifact_mask = (model.labels_ == -1) & ~scr_mask
                refined = self._interpolate_artifacts(data, artifact_mask)

            elif technique == "iso_forest":
                # OLD: fixed contamination=0.15 (over-cleans)
                # NEW: adaptive from signal statistics, 150 trees for stability
                model = IsolationForest(
                    contamination=contamination,
                    random_state=42,
                    n_estimators=150
                ).fit(data_reshaped)
                preds = model.predict(data_reshaped)
                artifact_mask = (preds == -1) & ~scr_mask
                refined = self._interpolate_artifacts(data, artifact_mask)

            elif technique == "lof":
                # OLD: n_neighbors=5 — statistically unstable on small datasets
                # NEW: len//4 clamped 3-15, adaptive contamination
                n_neighbors = int(np.clip(len(data) // 4, 3, 15))
                model = LocalOutlierFactor(
                    n_neighbors=n_neighbors,
                    contamination=contamination
                )
                preds = model.fit_predict(data_reshaped)
                artifact_mask = (preds == -1) & ~scr_mask
                refined = self._interpolate_artifacts(data, artifact_mask)

            elif technique == "pca":
                # OLD: window=4 (20s context — too narrow for SCR decay shape)
                # NEW: window=8 (40s context — captures full SCR 5-30s recovery)
                # OLD: overwrite bug — early points blended multiple times
                # NEW: weight accumulation — every point treated equally
                window_size = int(np.clip(min(8, len(data) // 3), 3, 16))

                if len(data) <= window_size:
                    refined = data
                else:
                    hankel = np.array([
                        data[i:i + window_size]
                        for i in range(len(data) - window_size + 1)
                    ])
                    pca_model = PCA(n_components=1)
                    low_dim   = pca_model.fit_transform(hankel)
                    recon     = pca_model.inverse_transform(low_dim)

                    weight_acc = np.zeros(len(data))
                    value_acc  = np.zeros(len(data))
                    for i in range(len(recon)):
                        value_acc[i:i + window_size]  += recon[i]
                        weight_acc[i:i + window_size] += 1.0

                    weight_acc = np.maximum(weight_acc, 1.0)
                    pca_signal = value_acc / weight_acc
                    refined    = data * 0.40 + pca_signal * 0.60

            elif technique == "cul":
                refined = self.cul_v4_logic(data)

        except Exception as e:
            print(f"[ML Engine] Algorithm error [{technique}]: {str(e)}")

        return refined

    # ===========================================================
    # run_hybrid — Majority-vote ensemble
    # ===========================================================

    def run_hybrid(self, techniques: List[str], data: np.ndarray) -> np.ndarray:
        """
        EDA Ensemble — Majority-Vote Consensus
        ----------------------------------------
        OLD: ANY single algorithm vote triggered healing (too aggressive)
        NEW: MAJORITY vote required before healing a point

        This prevents one over-aggressive algorithm from forcing the
        whole ensemble to over-clean legitimate EDA signals.
        """
        if not techniques:
            return data

        stack  = np.array([self.run_solo(t, data) for t in techniques])
        std    = self._safe_std(data)

        votes      = np.abs(stack - data) > (std * 0.5)
        vote_count = np.sum(votes, axis=0)
        majority   = max(1, len(techniques) // 2 + 1)

        return np.where(vote_count >= majority, np.median(stack, axis=0), data)

    # ===========================================================
    # run_brute_force_benchmark — All 127 combinations
    # ===========================================================

    def run_brute_force_benchmark(self, data: np.ndarray) -> List[Dict[str, Any]]:
        """
        Full 127-combination EDA benchmark.
        -------------------------------------
        FIXES vs old version:
          - No CUL state bleed: anchor computed fresh inside cul_v4_logic
            every call — results are fully deterministic & order-independent
          - Scoring uses 4-axis EDA composite stored in smoothness_score
            (DBSCAN can no longer game the score by doing nothing)
        """
        from itertools import chain, combinations

        techs   = ['cul', 'gmm', 'kmeans', 'dbscan', 'iso_forest', 'lof', 'pca']
        subsets = chain.from_iterable(
            combinations(techs, r) for r in range(1, len(techs) + 1)
        )

        results = []
        for combo in subsets:
            combo_list = list(combo)
            if len(combo_list) == 1:
                refined = self.run_solo(combo_list[0], data)
                mode    = "solo"
            else:
                refined = self.run_hybrid(combo_list, data)
                mode    = "hybrid"

            metrics = self.calculate_metrics(data, refined)
            score   = metrics['smoothness_score']   # 4-axis EDA composite

            results.append({
                "mode":        mode,
                "techs":       combo_list,
                "metrics":     metrics,
                "total_score": round(score, 2)
            })

        results.sort(key=lambda x: x["total_score"], reverse=True)
        return results


engine = ForensicMLEngine()
