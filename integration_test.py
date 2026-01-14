import sys
import os
import logging
from datetime import datetime

# Add src to path to allow imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from compliance.compliance_engine import ComplianceEngine
from telephony.carrier_adapter import MockCarrier
from dialer.dialer_manager import DialerManager

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("IntegrationTest")

def run_test():
    logger.info("Starting Global Outbound Dialer Integration Test...")

    # 1. Setup
    base_path = os.path.dirname(__file__)
    policies_path = os.path.join(base_path, 'src', 'config', 'policies.json')
    
    logger.info(f"Loading policies from {policies_path}")
    compliance = ComplianceEngine(policies_path)
    carrier = MockCarrier()
    dialer = DialerManager(compliance, carrier)
    
    # 2. Configure Dialer
    dialer.set_agent_availability(5) # Set 5 agents available

    # 3. Define Test Cases
    leads = [
        {
            "id": "L1-EG-Valid",
            "phone_number": "+201234567890",
            "region": "EG",
            "attempts_today": 0,
            "attempts_week": 0,
            "has_consent": False # EG doesn't strictly require explicit consent token in this policy, check json
        },
        {
            "id": "L2-UAE-NoConsent",
            "phone_number": "+971501234567",
            "region": "UAE",
            "attempts_today": 0,
            "has_consent": False # UAE requires consent
        },
        {
            "id": "L3-SA-MaxAttempts",
            "phone_number": "+966501234567",
            "region": "SA",
            "attempts_today": 5, # Limit is 4
            "has_consent": True
        }
    ]

    # 4. Run Tests
    for lead in leads:
        logger.info(f"Processing Lead: {lead['id']}")
        result = dialer.process_lead(lead, campaign_mode="PROGRESSIVE")
        logger.info(f"Result for {lead['id']}: {result}\n")

    logger.info("Test Run Complete.")

if __name__ == "__main__":
    run_test()
