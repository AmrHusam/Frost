import json
import logging
from datetime import datetime, time
import pytz
from typing import Dict, Any, Optional

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ComplianceEngine")

class ComplianceEngine:
    def __init__(self, policies_path: str):
        self.policies = self._load_policies(policies_path)

    def _load_policies(self, path: str) -> Dict[str, Any]:
        try:
            with open(path, 'r') as f:
                data = json.load(f)
                return data.get("policies", {})
        except Exception as e:
            logger.error(f"Failed to load policies from {path}: {e}")
            raise

    def check_compliance(self, context: Dict[str, Any]) -> str:
        """
        Evaluates strict compliance rules for a call attempt.
        Context must contain: 'destination', 'region', 'attempts_today', 'attempts_week', 'has_consent'
        """
        region = context.get("region", "GLOBAL")
        policy = self.policies.get(region)
        
        if not policy:
            logger.warning(f"No policy found for region {region}, defaulting to GLOBAL")
            policy = self.policies.get("GLOBAL")

        # 1. Consent Check
        if policy.get("requires_consent") and not context.get("has_consent"):
            return "DENY: NO_CONSENT"

        # 2. Max Attempts Check
        if context.get("attempts_today", 0) >= policy.get("max_attempts_daily", 999):
            return "DENY: DAILY_LIMIT_REACHED"
            
        if context.get("attempts_week", 0) >= policy.get("max_attempts_weekly", 999):
            return "DENY: WEEKLY_LIMIT_REACHED"

        # 3. Time Window Check
        if not self._is_within_time_window(policy):
            return "DENY: OUTSIDE_TIME_WINDOW"
            
        # 4. Blocked Days Check
        if self._is_blocked_day(policy):
             return "DENY: BLOCKED_DAY"

        # 5. Caller ID Enforcement
        if policy.get("require_caller_id") and not context.get("caller_id"):
            return "DENY: CALLER_ID_REQUIRED"

        # 5.1 NTRA: Approved Caller ID Check
        start_allowed_ids = policy.get("approved_caller_ids")
        if start_allowed_ids:
             if context.get("caller_id") not in start_allowed_ids:
                 return "DENY: UNREGISTERED_CALLER_ID"

        # 6. DNC Scrubbing (Simulation)
        if policy.get("enable_dnc_scrubbing"):
             if self._is_in_dnc_list(context.get("destination")):
                 return "DENY: DNC_LISTED"

        return "ALLOW"

    def _is_within_time_window(self, policy: Dict[str, Any]) -> bool:
        tz_name = policy.get("timezone", "UTC")
        tz = pytz.timezone(tz_name)
        now_local = datetime.now(tz)
        
        start_str = policy["allowed_hours"]["start"]
        end_str = policy["allowed_hours"]["end"]
        
        start_time = datetime.strptime(start_str, "%H:%M").time()
        end_time = datetime.strptime(end_str, "%H:%M").time()
        
        return start_time <= now_local.time() <= end_time

    def _is_blocked_day(self, policy: Dict[str, Any]) -> bool:
        tz_name = policy.get("timezone", "UTC")
        tz = pytz.timezone(tz_name)
        now_local = datetime.now(tz)
        
        current_day = now_local.strftime("%A")
        return current_day in policy.get("blocked_days", [])

    def _is_in_dnc_list(self, destination: str) -> bool:
        # Stub: In real system, this checks Redis/Database
        # Simulating a blocked number
        blocked_numbers = ["+971500000000", "+201000000000"]
        return destination in blocked_numbers

# Example Usage Stub
if __name__ == "__main__":
    import os
    # Assuming running from src/compliance relative path issues might need adjustment in real env
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'policies.json')
    engine = ComplianceEngine(path)
    
    test_context = {
        "region": "EG",
        "attempts_today": 0,
        "attempts_week": 0,
        "has_consent": True
    }
    
    result = engine.check_compliance(test_context)
    print(f"Compliance Check Result: {result}")
