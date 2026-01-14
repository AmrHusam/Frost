"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dialerController_1 = require("../controllers/dialerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Init Call: Agent Only
router.post('/dial', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['AGENT']), dialerController_1.initiateManualCall);
// Disposition: Agent Only (on wrap-up)
router.post('/disposition', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['AGENT']), dialerController_1.submitDisposition);
exports.default = router;
