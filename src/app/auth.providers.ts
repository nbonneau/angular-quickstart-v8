import { AuthProviderConfig } from '@core/services/auth.service';
import { MockUserProviderService } from '@core/endpoints/providers/mock-user-provider.service';

export const AUTH_PROVIDERS: Array<AuthProviderConfig> = [{
    name: 'mock',
    class: MockUserProviderService as any
}];
