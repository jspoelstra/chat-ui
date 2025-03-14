export enum BotMessageTypes {
  REQUEST = "request",
  RESPONSE = "response",
  PROGRESS = "progress",
  SYSTEM = "system",
  SYSRESPONSE = "system response"
}

export interface BotSystem {
  user_id: string | null;
  cmd: string;
  args: string[];
}

export interface BotRequest {
  user_id: string | null;
  human: string;
}

export interface BotProgress {
  bot_thoughts: string;
  tool: string;
  tool_input: Record<string, any>;
  tool_output: string;
}

export interface BotResponse {
  user_id: string | null;
  human: string;
  bot_text: string;
  bot_thoughts: string;
  turn: number;
  eot: boolean;
  error: boolean;
  error_message: string;
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  successful_requests: number;
  total_cost: number;
  response_time: number;
  latency: number;
}

export interface BotSystemResponse {
  user_id: string | null;
  cmd: string;
  error: boolean;
  response: string;
}

export interface BaseMessage {
  type: BotMessageTypes;
  data: any;
}

export interface BotSystemMsg extends BaseMessage {
  type: BotMessageTypes.SYSTEM;
  data: BotSystem;
}

export interface BotRequestMsg extends BaseMessage {
  type: BotMessageTypes.REQUEST;
  data: BotRequest;
}

export interface BotProgressMsg extends BaseMessage {
  type: BotMessageTypes.PROGRESS;
  data: BotProgress;
}

export interface BotResponseMsg extends BaseMessage {
  type: BotMessageTypes.RESPONSE;
  data: BotResponse;
}

export interface BotSystemResponseMsg extends BaseMessage {
  type: BotMessageTypes.SYSRESPONSE;
  data: BotSystemResponse;
}

export type BotMsg = BotSystemMsg | BotRequestMsg | BotProgressMsg | BotResponseMsg | BotSystemResponseMsg;