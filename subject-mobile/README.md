# 🧬 Signal Forge: Forensic Biometric Workstation 

**Signal Forge** is a high-performance, full-stack forensic workstation. This repository contains both the central analytics dashboard and the mobile terminal interface.

---

## 🚀 Quick Start Guide (Commands)

### 💻 1. Web Dashboard (eda-insight)
Use these commands to run the analytics workstation on your browser.
```bash
# Navigate to the folder
cd eda-insight

# Install dependencies
npm install

# Run in Development Mode
npm run dev



## 📱 Subject Mobile: Field Operations Manual

The `subject-mobile` app serves as the primary biometric ingestion point. It is designed for high-stress field environments where rapid "subject-to-workstation" pairing is required.

### 🔐 1. Authentication & Login
* **Access Level:** Requires Forensic Level 1 Authorization.
* **Process:** Users must log in via the secure mobile terminal to establish a session. This session is then cryptographically linked to the `eda-insight` dashboard via a secure handshake.

### 🤝 2. The "Two-Finger" Biometric Connection
This is the core biometric capture logic of the workstation.
* **Where we use it:** Inside the "Capture" module of the mobile app.(use expo go)
* **The Logic:** The system requires a dual-point touch (Two-Finger Connection) to stabilize the biometric signal. 
* **Purpose:** This reduces "noise" in the EDA (Electrodermal Activity) readings. By placing two fingers on the sensor interface, the app creates a complete circuit, allowing for a refined telemetry stream.
* **Visual Feedback:** The UI utilizes real-time haptic feedback and SVG-based wave animations to confirm when the connection is "Locked."

### 📡 3. Real-Time Sync
* Once the Two-Finger Connection is established, the mobile app streams the raw biometric data directly to the **Signal Forge Dashboard** (`eda-insight`).
* **Hardware Simulation:** If no physical sensors are present, the app utilizes a high-fidelity ML-simulation to mock realistic biometric fluctuations based on touch pressure.

# Navigate to the folder
cd subject-mobile

# Install dependencies
npm install

# Start Expo Go
npx expo start

