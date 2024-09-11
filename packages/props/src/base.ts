/* eslint-disable @typescript-eslint/no-unused-vars */
export type SizeType = 'small' | 'middle' | 'large' | undefined;

const ValidateStatuses = ['success', 'warning', 'error', 'validating', ''] as const;
export type ValidateStatus = (typeof ValidateStatuses)[number];
