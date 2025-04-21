import { startRetryLoop } from "./handler.js";
import { inspectDeadLetterQueue } from "./handler.js";

inspectDeadLetterQueue();
startRetryLoop();