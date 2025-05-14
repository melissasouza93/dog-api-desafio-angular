import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();
import { ngMocks } from 'ng-mocks';
ngMocks.autoSpy('jest');
