/* Do not change these import lines to match external modules in webpack configuration */
import * as grok from 'datagrok-api/grok';
import * as ui from 'datagrok-api/ui';
import * as DG from 'datagrok-api/dg';

import '@datagrok/js-draw-lite/src/types/jsdraw2';

export const _package = new DG.Package();

//tags: init
export async function initHELMWebEditor(): Promise<void> {
  await grok.functions.call('JsDrawLite:ensureLoadJsDrawLite')
    .then(() => {
      loadModules();
    });
}

function loadModules(): void {
  // Based on _merge.helm.bat
  require('../helm/helm');
  require('../helm/Interface');
  require('../helm/MonomerColors');
  require('../helm/Monomers');
  require('../helm/Plugin');
  require('../helm/Chain');
  require('../helm/Layout');
  require('../helm/IO');
  require('../helm/MonomerExplorer');
  require('../helm/MolViewer');
  require('../helm/Formula');
  // require('./Editor'); // File not found
  require('../helm/ExtinctionCoefficient');
  require('../helm/App');
  require('../helm/AppToolbar');
  require('../helm/MonomerLibApp');
  require('../helm/RuleSet');
  require('../helm/RuleSetApp');
  require('../helm/Adapter');
}

//name: ensureLoadHELMWebEditor
export async function ensureLoadHELMWebEditor(): Promise<void> {
  _package.logger.debug(`Package '${_package.friendlyName}' loaded.`);
}
