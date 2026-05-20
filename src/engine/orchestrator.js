// Orchestrator — Coordinates all 4 agents in sequence
// Emits agent state updates and structured event objects for UI consumption

import { linguistAgent } from './linguist.js';
import { scoutAgent } from './scout.js';
import { negotiatorAgent } from './negotiator.js';
import { butlerAgent } from './butler.js';

// Agent state constants
export const AGENT_STATES = {
  IDLE: 'idle',
  THINKING: 'thinking',
  RUNNING: 'running',
  DONE: 'done',
  ERROR: 'error',
};

// Agent IDs
export const AGENTS = {
  LINGUIST: 'linguist',
  SCOUT: 'scout',
  NEGOTIATOR: 'negotiator',
  BUTLER: 'butler',
};

// Agent display metadata
export const AGENT_META = {
  linguist: { label: 'Agent A — Linguist', description: 'Natural Language Understanding', color: '#6ee7b7', icon: '🧠' },
  scout: { label: 'Agent B — Scout', description: 'Provider Discovery & Ranking', color: '#67e8f9', icon: '🔍' },
  negotiator: { label: 'Agent C — Negotiator', description: 'Booking & Confirmation', color: '#fbbf24', icon: '🤝' },
  butler: { label: 'Agent D — Butler', description: 'Follow-Up Automation', color: '#c084fc', icon: '🔔' },
};

export async function runOrchestrator(userInput, callbacks = {}) {
  const { onAgentState, onEvent, onProgress } = callbacks;

  const emitEvent = (evt) => {
    onEvent?.({
      timestamp: new Date().toISOString(),
      ...evt,
    });
  };

  Object.keys(AGENTS).forEach((key) => {
    onAgentState?.(AGENTS[key], AGENT_STATES.IDLE, 'Waiting...');
  });

  const result = {
    intent: null,
    providers: [],
    relaxed: false,
    booking: null,
    notifications: [],
    reasoning: '',
    explanation: null,
    query_type: 'unknown'
  };

  try {
    // ========== STEP 1: Linguist ==========
    onProgress?.(1, 4);
    emitEvent({ agent: 'orchestrator', type: 'PIPELINE_START', message: `Starting pipeline for: "${userInput}"` });
    
    // Dynamic Linguist Message
    const truncatedQuery = userInput.length > 30 ? userInput.substring(0, 30) + '...' : userInput;
    onAgentState?.(AGENTS.LINGUIST, AGENT_STATES.RUNNING, `Query samajh raha hoon: "${truncatedQuery}"`);
    
    result.intent = await linguistAgent(userInput, emitEvent);
    result.query_type = result.intent.query_type;
    result.explanation = result.intent.explanation;

    if (result.query_type === 'unknown') {
      onAgentState?.(AGENTS.LINGUIST, AGENT_STATES.ERROR, `Samajh nahi aaya`);
      emitEvent({ agent: 'orchestrator', type: 'PIPELINE_ABORTED', message: 'Unknown query type' });
      // Reset others
      Object.values(AGENTS).forEach((agentId) => {
         if(agentId !== AGENTS.LINGUIST) onAgentState?.(agentId, AGENT_STATES.IDLE, '');
      });
      return result;
    }

    onAgentState?.(AGENTS.LINGUIST, AGENT_STATES.DONE, `Extracted: ${result.intent.category} in ${result.intent.area || 'any area'}`);

    // ========== STEP 2: Scout ==========
    onProgress?.(2, 4);
    
    // Dynamic Scout Message
    const areaText = result.intent.area ? `${result.intent.area} mein` : 'Aapke qareeb';
    onAgentState?.(AGENTS.SCOUT, AGENT_STATES.RUNNING, `${areaText} ${result.intent.category} dhundh raha hoon...`);
    
    const scoutResult = await scoutAgent(result.intent, emitEvent);
    result.providers = scoutResult.providers;
    result.relaxed = scoutResult.relaxed;
    result.reasoning = scoutResult.reasoning;
    
    if (result.providers.length === 0) {
        onAgentState?.(AGENTS.SCOUT, AGENT_STATES.DONE, `Koi provider nahi mila.`);
        emitEvent({ agent: 'scout', type: 'NO_PROVIDERS_FOUND', data: { category: result.intent.category, area: result.intent.area } });
        // Can't negotiate or butler without providers
        Object.values(AGENTS).forEach((agentId) => {
          if(agentId === AGENTS.NEGOTIATOR || agentId === AGENTS.BUTLER) onAgentState?.(agentId, AGENT_STATES.IDLE, 'Skipped');
       });
       return result;
    }
    
    onAgentState?.(AGENTS.SCOUT, AGENT_STATES.DONE, `Found ${result.providers.length} providers — Top: ${result.providers[0]?.name}`);

    // ========== STEP 3: Negotiator ==========
    onProgress?.(3, 4);
    
    let booked = false;
    for (const provider of result.providers) {
      onAgentState?.(AGENTS.NEGOTIATOR, AGENT_STATES.RUNNING, `${provider.name} ke saath slot verify ho raha hai...`);
      const negResult = await negotiatorAgent(provider, result.intent, emitEvent);
      if (negResult.success) {
        result.booking = negResult.booking;
        booked = true;
        break;
      }
      emitEvent({ agent: 'negotiator', type: 'RETRY_NEXT', message: `${provider.name} unavailable, trying next provider...` });
    }

    if (booked) {
      onAgentState?.(AGENTS.NEGOTIATOR, AGENT_STATES.DONE, `Booked: ${result.booking.id}`);
    } else {
      onAgentState?.(AGENTS.NEGOTIATOR, AGENT_STATES.ERROR, 'No available providers for booking');
      emitEvent({ agent: 'negotiator', type: 'BOOKING_FAILED', message: 'All providers are currently unavailable' });
    }

    // ========== STEP 4: Butler ==========
    onProgress?.(4, 4);
    
    if (booked) {
      const bookingTime = result.booking.time;
      onAgentState?.(AGENTS.BUTLER, AGENT_STATES.RUNNING, `${bookingTime} ka reminder set ho raha hai...`);
      
      const butlerResult = await butlerAgent(result.booking, emitEvent);
      result.notifications = butlerResult.notifications;
      onAgentState?.(AGENTS.BUTLER, AGENT_STATES.DONE, `${result.notifications.length} follow-up actions scheduled`);
    } else {
      onAgentState?.(AGENTS.BUTLER, AGENT_STATES.IDLE, 'Skipped due to booking failure');
    }

    emitEvent({ agent: 'orchestrator', type: 'PIPELINE_COMPLETE', message: 'Pipeline complete' });

  } catch (error) {
    emitEvent({ agent: 'orchestrator', type: 'PIPELINE_ERROR', message: `Error: ${error.message}` });
    throw error;
  }

  return result;
}
