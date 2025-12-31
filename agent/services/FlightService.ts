export interface FlightTicket {
     
     id: string;
     price: number;
     destination: string;
}

export class MockFlightService {
    async findTicket(): Promise<FlightTicket> {
        return {
            id: "TK-99",
            price: 100, // Wei cinsinden düşünelim şimdilik
            destination: "London"
        };
    }
}

