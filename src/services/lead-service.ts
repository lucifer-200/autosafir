import type { BookingFormValues } from "@/schemas/booking";
import type { SellCarFormValues } from "@/schemas/sell-car";

export interface DemoLeadReceipt {
  id: string;
  createdAt: string;
  delivered: false;
}

export interface LeadService {
  submitSellCar(input: SellCarFormValues): Promise<DemoLeadReceipt>;
  submitBooking(input: BookingFormValues): Promise<DemoLeadReceipt>;
}

export class DemoLeadService implements LeadService {
  async submitSellCar(_input: SellCarFormValues): Promise<DemoLeadReceipt> {
    void _input;
    return this.createReceipt("sell");
  }

  async submitBooking(_input: BookingFormValues): Promise<DemoLeadReceipt> {
    void _input;
    return this.createReceipt("visit");
  }

  private createReceipt(prefix: string): DemoLeadReceipt {
    return {
      id: `${prefix}-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      delivered: false,
    };
  }
}

export const demoLeadService: LeadService = new DemoLeadService();
