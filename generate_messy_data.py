import pandas as pd
import numpy as np
import random
import os

def generate_user_data(user_id, age, gen, num_windows=1000, baseline_start=2.0, noise_level="extreme"):
    data = []
    baseline = baseline_start
    
    # 5-second windows
    for w in range(1, num_windows + 1):
        # 1. Natural SCL tonic drift (slow wandering baseline)
        baseline += np.random.normal(0, 0.05)
        baseline = max(0.5, baseline) # physically impossible to be below 0.5
        
        # 2. Natural SCRs (legitimate sweat responses)
        scr_amp = 0
        if np.random.random() < 0.05: # 5% chance of an SCR event
            scr_amp = np.random.uniform(0.1, 2.5)
            
        # Clean EDA mean value
        eda_val = baseline + scr_amp + np.random.normal(0, 0.02)
        
        motion_flag = 0
        
        # 3. Inject terrible, messy artifacts
        prob_artifact = 0.15 if noise_level == "extreme" else 0.08
        
        if np.random.random() < prob_artifact:
            motion_flag = 1
            artifact_type = np.random.choice([
                "massive_spike",    # sudden jerk or hit on the sensor
                "drop_to_zero",     # temporary disconnection
                "high_freq_jitter", # rubbing the sensor rapidly
                "sensor_peel"       # loose contact
            ])
            
            if artifact_type == "massive_spike":
                eda_val += np.random.uniform(6.0, 18.0) # Massive physically impossible spikes
            elif artifact_type == "drop_to_zero":
                eda_val = np.random.uniform(0.01, 0.3)
            elif artifact_type == "high_freq_jitter":
                eda_val += np.random.normal(0, 3.5)
            elif artifact_type == "sensor_peel":
                eda_val -= np.random.uniform(1.0, baseline)
                eda_val = max(0.1, eda_val)
        
        row = {
            "User_ID": user_id,
            "Age": age,
            "Gen": gen,
            "BSR": round(np.random.normal(0.4, 0.1), 4),
            "Win": w,
            "EDA_Mean": round(eda_val, 4),
            "EDA_Std": round(np.random.uniform(0.05, 0.5) + (1.5 if motion_flag else 0), 4),
            "SCL_Tonic": round(baseline, 4),
            "SCR_Peaks": 1 if scr_amp > 0 else 0,
            "SCR_Amp": round(scr_amp, 4),
            "Slope_Max": round(np.random.uniform(0.01, 0.3) + (2.5 if motion_flag else 0), 4),
            "Entropy": round(np.random.uniform(0.4, 1.2) + (0.8 if motion_flag else 0), 4),
            "Motion": motion_flag
        }
        data.append(row)
        
    return pd.DataFrame(data)

# Set a NEW random seed so the data is completely fresh and different from the first batch
np.random.seed(99)
random.seed(99)

out_dir = r"c:\Users\manoh\Downloads\EDA\eda_f"

print("Generating 1st NEW Solo File (Subject 02)...")
df_solo1 = generate_user_data("U_02", 31, "F", num_windows=1000, baseline_start=1.8, noise_level="extreme")
df_solo1.to_csv(os.path.join(out_dir, "EDA_SOLO_SUBJECT_02_MESSY.csv"), index=False)

print("Generating 2nd NEW Solo File (Subject 03)...")
df_solo2 = generate_user_data("U_03", 45, "M", num_windows=1000, baseline_start=5.2, noise_level="extreme")
df_solo2.to_csv(os.path.join(out_dir, "EDA_SOLO_SUBJECT_03_MESSY.csv"), index=False)

print("Generating NEW Group File (20 subjects, 100 windows each)...")
dfs = []
for i in range(101, 121):  # distinct user IDs (U_101 to U_120)
    uid = f"U_{i}"
    age = random.randint(18, 65)
    gen = random.choice(["M", "F"])
    base = random.uniform(2.0, 7.5)
    df_u = generate_user_data(uid, age, gen, num_windows=100, baseline_start=base, noise_level="extreme")
    dfs.append(df_u)
    
df_group2 = pd.concat(dfs)
df_group2.to_csv(os.path.join(out_dir, "EDA_GROUP_02_MESSY.csv"), index=False)

print("✅ 3 NEW data files successfully generated.")
