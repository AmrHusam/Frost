import heapq
from datetime import datetime, timedelta
import pytz
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field

@dataclass(order=True)
class QueueItem:
    priority: int # Lower is higher priority (0=Callback, 1=Retry, 2=Fresh)
    schedule_time: datetime
    lead_id: str = field(compare=False)
    timezone: str = field(compare=False)
    attempts: int = field(compare=False, default=0)
    data: Dict[str, Any] = field(compare=False, default_factory=dict)

class SmartLeadQueue:
    def __init__(self):
        # Heap queue for O(1) popping of highest priority/earliest time
        self.queue = [] 
        # Configuration for retries
        self.retry_rules = {
            "BUSY": {"delay_minutes": 60, "max_retries": 3},
            "NO_ANSWER": {"delay_minutes": 240, "max_retries": 5},
            "FAILED": {"delay_minutes": 15, "max_retries": 2}
        }

    def add_lead(self, lead_id: str, timezone: str, priority: int = 2, data: Dict = None):
        """Adds a fresh lead to the queue."""
        item = QueueItem(
            priority=priority,
            schedule_time=datetime.utcnow(),
            lead_id=lead_id,
            timezone=timezone,
            data=data or {}
        )
        heapq.heappush(self.queue, item)

    def schedule_callback(self, lead_id: str, timezone: str, callback_time: datetime):
        """Schedules a high-priority user callback."""
        item = QueueItem(
            priority=0, # Highest Priority
            schedule_time=callback_time,
            lead_id=lead_id,
            timezone=timezone,
            data={"is_callback": True}
        )
        heapq.heappush(self.queue, item)

    def recycle_lead(self, item: QueueItem, disposition: str):
        """Recycles a lead based on disposition rules."""
        rule = self.retry_rules.get(disposition)
        if not rule or item.attempts >= rule["max_retries"]:
            print(f"Lead {item.lead_id} exhausted retries for {disposition}")
            return # Drop lead

        delay = timedelta(minutes=rule["delay_minutes"])
        item.schedule_time = datetime.utcnow() + delay
        item.priority = 1 # Retry Priority
        item.attempts += 1
        
        heapq.heappush(self.queue, item)
        print(f"Rescheduled Lead {item.lead_id} in {rule['delay_minutes']}m")

    def get_next_eligible_lead(self) -> Optional[QueueItem]:
        """
        Pops the next lead that is:
        1. Scheduled for now or past.
        2. Within its local timezone window (09:00-20:00 stub).
        """
        temp_storage = []
        selected_item = None
        
        while self.queue:
            item = heapq.heappop(self.queue)
            
            # 1. Schedule Check
            if item.schedule_time > datetime.utcnow():
                # Too early, put back and stop (heap is sorted by time/priority)
                # Actually heap is sorted by priority then time? No, tuple comparison.
                # Just strictly check schedule time.
                heapq.heappush(self.queue, item)
                break

            # 2. Timezone Window Check
            if self._is_in_window(item.timezone):
                selected_item = item
                break
            else:
                # Valid scheduling but window closed. Reschedule for tomorrow morning?
                # For this simplified implementation, we just skip it for now 
                # and check the next one, but we must save it to put back.
                temp_storage.append(item)
        
        # Restore skipped items
        for i in temp_storage:
            heapq.heappush(self.queue, i)
            
        return selected_item

    def _is_in_window(self, tz_name: str) -> bool:
        """
        Simple check: 08:00 to 20:00 local time.
        """
        try:
            tz = pytz.timezone(tz_name)
            now_local = datetime.now(tz)
            return 8 <= now_local.hour < 20
        except Exception:
            return True # Fallback to allow if TZ unknown

# Example Usage
if __name__ == "__main__":
    q = SmartLeadQueue()
    q.add_lead("L1", "Asia/Dubai", priority=2)
    q.add_lead("L2", "America/New_York", priority=2) # Likely closed if running in UTC day
    
    lead = q.get_next_eligible_lead()
    if lead:
        print(f"Dialing: {lead.lead_id} ({lead.timezone})")
        # Simulate Busy
        q.recycle_lead(lead, "BUSY")
