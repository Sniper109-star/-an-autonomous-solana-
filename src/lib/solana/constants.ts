export const SOLANA_PROGRAMS = {
  system: "11111111111111111111111111111111",
  token: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  token2022: "TokenzQdBNbLqP5VEhdkAS6EPFxcn9q2fctXJZGn5gM",
  associatedToken: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  memo: "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo",
  computeBudget: "ComputeBudget111111111111111111111111111111",
  raydiumV4: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
  raydiumV5: "CPMMoo8L3w4NbR8AH9UEvum6t8QJ6XmVjWfF8m9Yz5b",
  raydiumClmm: "CAMMCzo5YL8w4VFF8KVHrK22GGUQpMpTFb6xRmpLFGNn",
  meteoraDlmm: "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo",
  jupiterAggregatorV6: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
} as const;

export const DEFAULT_DEX_PROGRAMS = [
  SOLANA_PROGRAMS.raydiumV4,
  SOLANA_PROGRAMS.raydiumV5,
  SOLANA_PROGRAMS.raydiumClmm,
  SOLANA_PROGRAMS.meteoraDlmm,
  SOLANA_PROGRAMS.jupiterAggregatorV6,
];

export const DEFAULT_WATCHED_MINTS = [
  "So11111111111111111111111111111111111111112",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "Es9vMFrzaCERmJfrF4H2FYD4Yz4vZfM8UQ3W9v2VvT",
];
