import numpy as np
from sklearn.mixture import GaussianMixture
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans, DBSCAN
from sklearn.neighbors import LocalOutlierFactor
from sklearn.decomposition import PCA
from scipy import signal
from typing import List, Dict, Any

import os
import pandas as pd

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
        # Use a fixed bin range [min(data), max(data)] or global biometric range
        # For small data, we use 10 bins over the local range but handle 0-variance
        data_range = np.max(refined) - np.min(refined)
        if data_range < 0.0001:
            entropy = 0.0
        else:
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
        Modified for Instant Forensic Cleaning:
        If no anchor exists, it creates one from the median of the current batch
        and immediately performs the cleaning pass.
        """
        # Reset anchor context for fresh batch if needed, or use existing for drift
        current_median = np.median(data)
        if self.history_anchor is None:
            self.history_anchor = current_median
        
        # Calculate contrastive distance from anchor
        distance = np.abs(data - self.history_anchor)
        
        # Aggressive Threshold: 1.5 standard deviations + micro-floor
        threshold = np.std(data) * 1.5 + 0.001
        
        # Perform the Heal
        refined = np.where(distance > threshold, self.history_anchor, data)
        
        # Update anchor with slow temporal drift for next packet
        self.history_anchor = 0.9 * self.history_anchor + 0.1 * np.mean(refined)
        return refined

    def run_solo(self, technique: str, data: np.ndarray) -> np.ndarray:
        """
        Executes a specific unsupervised technique with aggressive forensic tuning.
        """
        data_reshaped = data.reshape(-1, 1)
        refined = data.copy()
        window_median = np.median(data)

        try:
            if technique == "gmm":
                # GMM is inherently aggressive, keeping current logic
                model = GaussianMixture(n_components=2, random_state=42).fit(data_reshaped)
                means = model.means_.flatten()
                baseline_cluster = np.argmin(means)
                labels = model.predict(data_reshaped)
                refined = np.where(labels != baseline_cluster, means[baseline_cluster], data)

            elif technique == "kmeans":
                # INDESTRUCTIBLE NUMPY K-MEANS: Bypassing Sklearn for 1D Biometric Precision
                # We force two clusters starting at the absolute Min/Max
                c1, c2 = np.min(data), np.max(data)
                
                # If Min and Max are the same, no cleaning needed
                if np.abs(c1 - c2) < 0.001:
                    refined = data
                else:
                    # Forced 10-iteration Centroid Refinement
                    for _ in range(10):
                        # Assign labels based on Euclidean proximity in 1D
                        labels = np.array([0 if np.abs(x - c1) < np.abs(x - c2) else 1 for x in data])
                        
                        # Update centroids if clusters are non-empty
                        cluster0 = data[labels == 0]
                        cluster1 = data[labels == 1]
                        
                        if len(cluster0) > 0: c1 = np.mean(cluster0)
                        if len(cluster1) > 0: c2 = np.mean(cluster1)
                    
                    # IDENTIFY TRUTH: The Baseline cluster is mathematically closer to the MEDIAN
                    baseline_med = np.median(data)
                    baseline_cluster = 0 if np.abs(c1 - baseline_med) < np.abs(c2 - baseline_med) else 1
                    baseline_val = c1 if baseline_cluster == 0 else c2
                    
                    # EXTREME HEAL: Snap all artifact-cluster points to the Human Baseline center
                    refined = np.where(labels != baseline_cluster, baseline_val, data)

            elif technique == "dbscan":
                # LOWER EPS: Very sensitive to local density jumps
                model = DBSCAN(eps=0.03, min_samples=2).fit(data_reshaped)
                refined = np.where(model.labels_ == -1, window_median, data)

            elif technique == "iso_forest":
                # HIGHER CONTAMINATION: Attacks outliers more aggressively
                model = IsolationForest(contamination=0.15, random_state=42).fit(data_reshaped)
                preds = model.predict(data_reshaped)
                refined = np.where(preds == -1, window_median, data)

            elif technique == "lof":
                # LOCAL DENSITY SENSITIVITY
                model = LocalOutlierFactor(n_neighbors=min(len(data)//2, 5), contamination=0.15)
                preds = model.fit_predict(data_reshaped)
                refined = np.where(preds == -1, window_median, data)

            elif technique == "pca":
                # REFINED TRAJECTORY SMOOTHING
                window_size = 4
                if len(data) > window_size:
                    hankel = np.array([data[i:i + window_size] for i in range(len(data) - window_size + 1)])
                    pca_model = PCA(n_components=1)
                    low_dim = pca_model.fit_transform(hankel)
                    recon_hankel = pca_model.inverse_transform(low_dim)
                    
                    refined_p = data.copy()
                    for i in range(len(recon_hankel)):
                        # Weighted averaging for trend preservation
                        refined_p[i:i+window_size] = (refined_p[i:i+window_size] * 0.3) + (recon_hankel[i] * 0.7)
                    refined = refined_p

            elif technique == "cul":
                refined = self.cul_v4_logic(data)

        except Exception as e:
            print(f"Algorithm Error: {str(e)}")
            pass 

        return refined

    def run_hybrid(self, techniques: List[str], data: np.ndarray) -> np.ndarray:
        """
        Consensus Logic: Aggregated healing.
        """
        # Always reset anchor for fresh analysis window in Forge mode
        self.history_anchor = None
        
        if not techniques:
            return data
            
        individual_results = []
        for tech in techniques:
            individual_results.append(self.run_solo(tech, data))
        
        individual_results = np.array(individual_results)
        
        # HYPER-SENSITIVE CONSENSUS: If ANY model heals a point by > 0.005, it counts
        divergence = np.abs(individual_results - data) > 0.005
        vote_count = np.sum(divergence, axis=0)
        
        # Use the median suggestion of identifying models
        final_refined = np.where(vote_count > 0, 
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
