import * as grok from 'datagrok-api/grok';
import * as ui from 'datagrok-api/ui';
import * as DG from 'datagrok-api/dg';

import {OrgHelmModuleType} from './org-helm';

export {OrgHelmModuleType};

type HelmWebEditorWindowType = {
  org: OrgHelmModuleType;
}

declare const window: HelmWebEditorWindowType;

export async function getHelmWebEditorModules(): Promise<HelmWebEditorWindowType> {
  await grok.functions.call('HelmWebEditor:ensureLoadHelmWebEditor');
  return window;
}
