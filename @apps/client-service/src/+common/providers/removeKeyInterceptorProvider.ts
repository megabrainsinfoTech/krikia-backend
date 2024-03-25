import { Provider } from '@nestjs/common';
import { RemoveKeysInterceptor } from '../interceptors/RemoveKeysInterceptor';
/**
 * @description This Provide is used to remove sensentive keys from leaking to the user network
 * @author <a href="https://github.com/feelchi1star">Felix Chinonso Emmanuel</a>
 */
export const RemoveKeysInterceptorProvider: Provider = {
  provide: RemoveKeysInterceptor,
  useFactory: () => new RemoveKeysInterceptor(['password']), // Specify keys to remove here
};
