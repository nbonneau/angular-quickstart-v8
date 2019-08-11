import { MockUserProviderService } from '@core/endpoints/providers/mock-user-provider.service';

// Add endpoints here
export interface EndpointsInterface {
    mockUser: MockUserProviderService;
}

// Add endpoints here
export const ENDPOINTS: EndpointsInterface = {
    mockUser: MockUserProviderService as any
};
