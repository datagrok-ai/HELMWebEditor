import '@datagrok/js-draw-lite/src/types/jsdraw2';
import {jsDrawLiteInitPromise} from '@datagrok/js-draw-lite/src/package';

//tags: init
export async function initHELMWebEditor(): Promise<void> {
  const logPrefix: string = 'HELMWebEditor: _package.initHELMWebEditor()';
  console.debug(`${logPrefix}, start`);

  await jsDrawLiteInitPromise;

  console.debug(`${logPrefix}, loadModules(), before`);
  await loadModules();
  console.debug(`${logPrefix}, loadModules(), after`);

  console.debug(`${logPrefix}, end`);
}

async function loadModules(): Promise<void> {
  require('../vendor/js-draw-lite');

  // Based on _merge.helm.bat
  require('../helm/helm');
  require('../helm/Interface');
  require('../helm/MonomerColors');
  require('../helm/Monomers');
  require('../helm/Plugin');
  require('../helm/Chain');
  require('../helm/Layout');
  await import(/* webpackMode: "eager" */ '../helm/IO');
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

// //name: ensureLoadHELMWebEditor
// export async function ensureLoadHELMWebEditor(): Promise<void> {
//   _package.logger.debug(`Package '${_package.friendlyName}' loaded.`);
// }

export const helmWebEditorInitPromise: Promise<void> = (async () => {
  await initHELMWebEditor();
})();
