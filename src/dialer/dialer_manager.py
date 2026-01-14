import time
import logging
from typing import List, Dict, Any
from ..compliance.compliance_engine import ComplianceEngine
from ..telephony.carrier_adapter import CarrierAdapter

logger = logging.getLogger("DialerManager")

class DialerManager:
    def __init__(self, compliance_engine: ComplianceEngine, carrier: CarrierAdapter):
        self.compliance = compliance_engine
        self.carrier = carrier
        self.active_calls = 0
        self.agents_available = 0

    def set_agent_availability(self, count: int):
        self.agents_available = count

    def process_lead(self, lead: Dict[str, Any], campaign_mode: str = "PROGRESSIVE"):
        """
        Main entry point to dial a lead.
        Enforces Compliance -> Checks Resources -> Dials.
        """
        # 1. Compliance Check (The Censor)
        compliance_context = {
            "region": lead.get("region", "GLOBAL"),
            "attempts_today": lead.get("attempts_today", 0),
            "attempts_week": lead.get("attempts_week", 0),
            "has_consent": lead.get("has_consent", False),
            "destination": lead.get("phone_number")
        }
        
        status = self.compliance.check_compliance(compliance_context)
        if status != "ALLOW":
            logger.warning(f"BLOCKED: Lead {lead['id']} blocked by compliance: {status}")
            return {"status": "BLOCKED", "reason": status}

        # 2. Resource Check (The Brain)
        if not self._can_dial(campaign_mode):
            logger.info(f"QUEUED: Lead {lead['id']} queued due to lack of resources/agents.")
            return {"status": "QUEUED", "reason": "NO_RESOURCES"}

        # 3. Execution (The Hands)
        try:
            call_id = self.carrier.dial(
                destination=lead["phone_number"], 
                caller_id=lead.get("caller_id", "Unknown")
            )
            self.active_calls += 1
            return {"status": "DIALING", "call_id": call_id}
        except Exception as e:
            logger.error(f"ERROR: Failed to dial lead {lead['id']}: {e}")
            return {"status": "ERROR", "reason": str(e)}

    def _can_dial(self, mode: str) -> bool:
        """
        Determines if a new call can be placed based on the dialing mode.
        """
        if mode == "PREVIEW":
            # In preview, agent explicitly requesting dial implies availability
            return True 
            
        elif mode == "PROGRESSIVE":
            # 1:1 Agent to Line ratio. Only dial if free agent > active calls? 
            # Simplified: assuming this process is triggered PER available agent slot.
            return self.agents_available > 0

        elif mode == "POWER":
            # Oversubscription logic. E.g., Dial if active calls < agents * 1.5
            return self.active_calls < (self.agents_available * 1.5)

        elif mode == "PREDUCTIVE":
            # Placeholder for complex Erlang-C or statistical model
            # For now, behaves like aggressive Power dialing
            return self.active_calls < (self.agents_available * 2.0)

        return False

    def on_call_ended(self, call_id: str):
        if self.active_calls > 0:
            self.active_calls -= 1
