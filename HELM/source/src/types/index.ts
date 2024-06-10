import {OrgType} from './org-helm';

export type HweWindow = {
  helmWebEditor$: {
    initPromise?: Promise<void>;
  },
  org: OrgType;
}
