import { ObjectId } from 'mongodb';
import lodash from 'lodash';
import slugify from 'slugify';
import { ParsedQs } from 'qs';
import { LIMIT_ITEMS, PAGE_DEFAULT } from './constant';
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
export const pagination = (query: ParsedQs) => {
  const limitPage = parseInt(query.limit as string, 10) || LIMIT_ITEMS;
  const pageCurrent = parseInt(query.page as string, 10) || PAGE_DEFAULT;
  return {
    limitPage,
    pageCurrent
  };
};
