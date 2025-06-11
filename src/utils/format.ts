import { ObjectId } from 'mongodb';
import lodash from 'lodash';
import slugify from 'slugify';

export const createObjectId = (id: string) => {
  return ObjectId.createFromHexString(id);
};
export const pickUser = (ob = {}, pickData = ['']) => {
  return lodash.pick(ob, pickData);
};
export const customSlug = (slug: string = '') => {
  return (
    slugify(slug, {
      lower: true,
      trim: true,
      locale: 'vi',
      strict: true
    }) +
    '-' +
    Date.now()
  );
};
