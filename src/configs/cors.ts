import { whitelist } from '~/utils/constant';
import env from './environments';
import { FORBIDDEN } from '~/core/errors.response';

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, options?: boolean) => void
  ) {
    if (env.BUILD_MODE === 'dev') {
      return callback(null, true);
    }
    if (origin !== undefined && whitelist.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new FORBIDDEN('Your domain is not compatible with my policy !'));
    }
  },
  optionsSuccessStatus: 204
};
export default corsOptions;
