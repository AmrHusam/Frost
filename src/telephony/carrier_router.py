import logging
from typing import Dict, List, Any, Optional
from .carrier_adapter import CarrierAdapter

logger = logging.getLogger("CarrierRouter")

class CarrierRouter:
    """
    Routes calls to specific carriers based on region and availability.
    Implements failover logic.
    """
    def __init__(self):
        # Map Region -> List of Carrier Adapters (Priority Order)
        self.routes: Dict[str, List[CarrierAdapter]] = {}
        self.default_carriers: List[CarrierAdapter] = []

    def register_carrier(self, region: str, carrier: CarrierAdapter):
        if region not in self.routes:
            self.routes[region] = []
        self.routes[region].append(carrier)
    
    def register_default_carrier(self, carrier: CarrierAdapter):
        self.default_carriers.append(carrier)

    def route_call(self, destination: str, caller_id: str, region: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Attempts to dial using registered carriers for the region.
        Fails over to next carrier if one fails.
        """
        carriers = self.routes.get(region, []) + self.default_carriers
        
        if not carriers:
            raise Exception(f"No carriers available for region {region}")

        errors = []
        for carrier in carriers:
            try:
                logger.info(f"Attempting dial via carrier: {carrier.__class__.__name__}")
                call_id = carrier.dial(destination, caller_id, metadata)
                return {"status": "SUCCESS", "call_id": call_id, "carrier": carrier.__class__.__name__}
            except Exception as e:
                logger.error(f"Carrier {carrier.__class__.__name__} failed: {e}")
                errors.append(str(e))
                continue
        
        return {"status": "FAILED", "reason": "All carriers failed", "errors": errors}

    def provision_local_number(self, region: str) -> str:
        """
        Provisions a number from the primary carrier for the region.
        """
        carriers = self.routes.get(region, self.default_carriers)
        if not carriers:
            raise Exception("No carrier to provision number")
        
        # Try primary carrier
        return carriers[0].provision_number(region)
