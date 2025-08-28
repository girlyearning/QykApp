import { Capacitor, registerPlugin } from '@capacitor/core';

export type QykQuotesState = {
  enabled: boolean;
  hour?: number;
  minute?: number;
};

export type ScheduleOptions = {
  hour: number;
  minute: number;
};

interface QykQuotesPlugin {
  requestPermissions(): Promise<void>;
  scheduleDailyQuote(options: ScheduleOptions): Promise<void>;
  cancelDailyQuote(): Promise<void>;
  getState(): Promise<QykQuotesState>;
  testNotify(): Promise<void>;
}

const webShim: QykQuotesPlugin = {
  async requestPermissions() {},
  async scheduleDailyQuote() {},
  async cancelDailyQuote() {},
  async getState() { return { enabled: false }; },
  async testNotify() {},
};

export const QykQuotes = Capacitor.getPlatform() === 'android'
  ? registerPlugin<QykQuotesPlugin>('QykQuotes')
  : webShim;
