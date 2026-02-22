import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans, DBSCAN
from sklearn.neighbors import LocalOutlierFactor
from sklearn.decomposition import PCA
from scipy import signal
from typing import List, Dict, Any

class ForensicMLEngine:
    def __init__(self):
        # Cache for historical data (for CUL-v4)
        self.history_anchor = None
        self.trial_history = []

    def calculate_metrics(self, raw: np.ndarray, refined: np.ndarray) -> Dict[str, float]:
        """
        The 'Brain' of the Auditor Bot: Measures reconstruction quality.
        """
        # Ensure we have enough data and scrub NaNs
        raw = np.nan_to_num(raw)
        refined = np.nan_to_num(refined)
        
        if len(refined) < 3:
            return {"smoothness_score": 0.0, "noise_suppression": 0.0, "stability_index": 0.0}

        # 1. Jerkiness (Smoothness)
        diff = np.diff(refined)
        jerk_val = np.mean(np.abs(np.diff(diff)))
        jerkiness = float(jerk_val) if not np.isnan(jerk_val) else 0.0
        
        # 2. Suppression Ratio
        reduction = float(np.sum(np.abs(raw - refined)))
        
        # 3. Discrete Shannon Entropy (Stable Index)
        hist, _ = np.histogram(refined, bins=10)
        probs = hist / np.sum(hist)
        probs = probs[probs > 0]
        entropy = float(-np.sum(probs * np.log2(probs)))
        
        # Final Scrub and Rounding
        res = {
            "smoothness_score": round(max(0.0, 100 - (jerkiness * 1000)), 2),
            "noise_suppression": round(reduction, 2),
            "stability_index": round(10 / (1 + entropy), 2)
        }
        return {k: (0.0 if np.isnan(v) or np.isinf(v) else v) for k, v in res.items()}

    def cul_v4_logic(self, data: np.ndarray) -> np.ndarray:
        """
        Contrastive Unsupervised Learning v4.
        Contrasts current window against a global anchor.
        """
        if self.history_anchor is None:
            self.history_anchor = np.mean(data)
            return data
        
        # Calculate contrastive distance
        distance = np.abs(data - self.history_anchor)
        threshold = np.std(data) * 2 + 0.1
        
        refined = np.where(distance > threshold, self.history_anchor, data)
        # Update anchor slowly (Slow baseline drift)
        self.history_anchor = 0.95 * self.history_anchor + 0.05 * np.mean(refined)
        return refined

    def run_solo(self, technique: str, data: np.ndarray) -> np.ndarray:
        """
        Executes a specific unsupervised technique.
        """
        data_reshaped = data.reshape(-1, 1)
        refined = data.copy()

        try:
            if technique == "gmm":
                model = GaussianMixture(n_components=2).fit(data_reshaped)
                # Pick the cluster with the lower mean as the baseline
                means = model.means_.flatten()
                baseline_cluster = np.argmin(means)
                labels = model.predict(data_reshaped)
                refined = np.where(labels != baseline_cluster, means[baseline_cluster], data)

            elif technique == "kmeans":
                model = KMeans(n_components=2, n_init='auto').fit(data_reshaped)
                means = model.cluster_centers_.flatten()
                baseline_cluster = np.argmin(means)
                labels = model.labels_
                refined = np.where(labels != baseline_cluster, means[baseline_cluster], data)

            elif technique == "dbscan":
                # Points with label -1 are noise
                model = DBSCAN(eps=0.3, min_samples=2).fit(data_reshaped)
                refined = np.where(model.labels_ == -1, np.median(data), data)

            elif technique == "iso_forest":
                model = IsolationForest(contamination=0.1).fit(data_reshaped)
                preds = model.predict(data_reshaped) # -1 is anomaly
                refined = np.where(preds == -1, np.median(data), data)

            elif technique == "lof":
                model = LocalOutlierFactor(n_neighbors=5, contamination=0.1)
                preds = model.fit_predict(data_reshaped)
                refined = np.where(preds == -1, np.median(data), data)

            elif technique == "pca":
                model = PCA(n_components=1).fit(data_reshaped)
                recon = model.inverse_transform(model.transform(data_reshaped)).flatten()
                refined = recon

            elif technique == "cul":
                refined = self.cul_v4_logic(data)

        except Exception:
            pass # Fallback to original data if model fails on small sample

        return refined

    def run_hybrid(self, techniques: List[str], data: np.ndarray) -> np.ndarray:
        """
        Ensemble Voting Logic.
        """
        if not techniques:
            return data
            
        individual_results = []
        for tech in techniques:
            individual_results.append(self.run_solo(tech, data))
        
        # Majority Vote: If a point is altered by > 50% of models, use the median of models
        individual_results = np.array(individual_results)
        # Check where models diverted from raw data
        divergence = np.abs(individual_results - data) > 0.1
        vote_count = np.sum(divergence, axis=0)
        
        consensus_threshold = len(techniques) / 2
        final_refined = np.where(vote_count > consensus_threshold, 
                                 np.median(individual_results, axis=0), 
                                 data)
        return final_refined

    def run_brute_force_benchmark(self, data: np.ndarray) -> List[Dict[str, Any]]:
        """
        Calculates every possible combination of ML models and ranks them by performance.
        """
        from itertools import chain, combinations
        
        techs = ['cul', 'gmm', 'kmeans', 'dbscan', 'iso_forest', 'lof', 'pca']
        # Generate all non-empty subsets
        subsets = chain.from_iterable(combinations(techs, r) for r in range(1, len(techs) + 1))
        
        results = []
        for combo in subsets:
            combo_list = list(combo)
            if len(combo_list) == 1:
                refined = self.run_solo(combo_list[0], data)
                mode = "solo"
            else:
                refined = self.run_hybrid(combo_list, data)
                mode = "hybrid"
            
            metrics = self.calculate_metrics(data, refined)
            # Use same weighting as frontend useMemo
            score = (metrics['stability_index'] * 10) + metrics['smoothness_score']
            
            results.append({
                "mode": mode,
                "techs": combo_list,
                "metrics": metrics,
                "total_score": score
            })
            
        # Sort by score descending
        results.sort(key=lambda x: x["total_score"], reverse=True)
        return results

engine = ForensicMLEngine()
