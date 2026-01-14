from abc import ABC, abstractmethod
from typing import Dict, Any

class CarrierAdapter(ABC):
    """
    Abstract Interface for Telephony Providers.
    Decouples the logic from specific APIs like Twilio, Nexmo, or SIP trunks.
    """

    @abstractmethod
    def dial(self, destination: str, caller_id: str, metadata: Dict[str, Any] = None) -> str:
        """
        Initiates a call.
        Returns: A unique Call ID provided by the carrier.
        """
        pass

    @abstractmethod
    def hangup(self, call_id: str) -> bool:
        """
        Terminates an active call.
        """
        pass
    
    @abstractmethod
    def get_call_status(self, call_id: str) -> str:
        """
        Returns normalized status: 'QUEUED', 'RINGING', 'IN-PROGRESS', 'COMPLETED', 'FAILED', 'BUSY', 'NO-ANSWER'
        """
        pass

    @abstractmethod
    def provision_number(self, region: str, capability: str = "voice") -> str:
        """
        Provisions a new local number.
        Returns: The provisioned phone number (E.164).
        """
        pass

class MockCarrier(CarrierAdapter):
    """
    A stub carrier for testing and development.
    """
    def __init__(self, name="MockCarrier"):
        self.name = name
        self.calls = {}
        import uuid
        self.uuid = uuid

    def dial(self, destination: str, caller_id: str, metadata: Dict[str, Any] = None) -> str:
        call_id = str(self.uuid.uuid4())
        print(f"[{self.name}] Dialing {destination} from {caller_id} (ID: {call_id})")
        self.calls[call_id] = "RINGING"
        return call_id

    def hangup(self, call_id: str) -> bool:
        if call_id in self.calls:
            print(f"[{self.name}] Hanging up call {call_id}")
            self.calls[call_id] = "COMPLETED"
            return True
        return False

    def get_call_status(self, call_id: str) -> str:
        return self.calls.get(call_id, "UNKNOWN")

    def provision_number(self, region: str, capability: str = "voice") -> str:
        print(f"[{self.name}] Provisioning number for {region}")
        return f"+{hash(region) % 10000000000}"

