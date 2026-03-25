#!/usr/bin/env python3
"""
Script to generate sample Excel files for testing Phase 2 upload functionality
"""

import pandas as pd
from datetime import datetime, timedelta
import os

# Create samples directory
os.makedirs('sample_data', exist_ok=True)

# Generate CDR sample data
cdr_data = {
    'caller': ['08001111111', '08002222222', '08003333333', '08001111111', '08002222222'],
    'receiver': ['08002222222', '08003333333', '08001111111', '08004444444', '08005555555'],
    'time': [
        datetime(2026, 1, 15, 10, 30, 0),
        datetime(2026, 1, 15, 11, 45, 0),
        datetime(2026, 1, 15, 14, 20, 0),
        datetime(2026, 1, 15, 15, 10, 0),
        datetime(2026, 1, 15, 16, 55, 0),
    ],
    'duration': [120, 300, 45, 200, 150],
    'tower_id': ['TOWER_001', 'TOWER_002', 'TOWER_001', 'TOWER_003', 'TOWER_002'],
}

cdr_df = pd.DataFrame(cdr_data)
cdr_df.to_excel('sample_data/cdr_sample.xlsx', index=False)
print(f"✓ Created CDR sample file ({len(cdr_df)} rows)")

# Generate Tower Dump sample data
tower_data = {
    'number': ['08001111111', '08001111111', '08002222222', '08002222222', '08003333333'],
    'tower_id': ['TOWER_001', 'TOWER_002', 'TOWER_001', 'TOWER_003', 'TOWER_002'],
    'time': [
        datetime(2026, 1, 15, 10, 0, 0),
        datetime(2026, 1, 15, 11, 0, 0),
        datetime(2026, 1, 15, 14, 0, 0),
        datetime(2026, 1, 15, 15, 0, 0),
        datetime(2026, 1, 15, 16, 0, 0),
    ],
    'location': ['Downtown Area', 'Airport Area', 'Downtown Area', 'Shopping Mall', 'Hospital Area'],
}

tower_df = pd.DataFrame(tower_data)
tower_df.to_excel('sample_data/tower_sample.xlsx', index=False)
print(f"✓ Created Tower sample file ({len(tower_df)} rows)")

# Generate IPDR sample data
ipdr_data = {
    'number': ['08001111111', '08001111111', '08002222222', '08003333333', '08002222222'],
    'ip': ['192.168.1.1', '192.168.1.2', '10.0.0.1', '172.16.0.1', '10.0.0.2'],
    'time': [
        datetime(2026, 1, 15, 9, 0, 0),
        datetime(2026, 1, 15, 10, 30, 0),
        datetime(2026, 1, 15, 13, 0, 0),
        datetime(2026, 1, 15, 14, 15, 0),
        datetime(2026, 1, 15, 15, 45, 0),
    ],
    'site': ['Facebook.com', 'Twitter.com', 'YouTube.com', 'Instagram.com', 'WhatsApp.com'],
}

ipdr_df = pd.DataFrame(ipdr_data)
ipdr_df.to_excel('sample_data/ipdr_sample.xlsx', index=False)
print(f"✓ Created IPDR sample file ({len(ipdr_df)} rows)")

# Generate Crime Events sample data
crime_data = {
    'crime': ['Robbery', 'Theft', 'Robbery', 'Assault', 'Crime'],
    'tower': ['TOWER_001', 'TOWER_002', 'TOWER_001', 'TOWER_003', 'TOWER_002'],
    'time': [
        datetime(2026, 1, 15, 10, 30, 0),
        datetime(2026, 1, 15, 11, 45, 0),
        datetime(2026, 1, 15, 14, 20, 0),
        datetime(2026, 1, 15, 15, 10, 0),
        datetime(2026, 1, 15, 16, 55, 0),
    ],
}

crime_df = pd.DataFrame(crime_data)
crime_df.to_excel('sample_data/crime_sample.xlsx', index=False)
print(f"✓ Created Crime sample file ({len(crime_df)} rows)")

print("\n" + "="*50)
print("Sample data files created successfully!")
print("="*50)
print("\nLocation: sample_data/")
print("Files:")
print("  - cdr_sample.xlsx")
print("  - tower_sample.xlsx")
print("  - ipdr_sample.xlsx")
print("  - crime_sample.xlsx")
print("\nUse these files to test the /upload endpoint")
