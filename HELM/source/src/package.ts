import '@datagrok/js-draw-lite/src/types/jsdraw2';

import {JSDraw2Window} from '@datagrok/js-draw-lite/src/types';
import {HweWindow} from './types';

declare const window: Window & HweWindow & JSDraw2Window;

//tags: init
export async function initHELMWebEditor(): Promise<void> {
  window.helmWebEditor$ = window.helmWebEditor$ || {};
  if (!window.helmWebEditor$.initPromise) {
    window.helmWebEditor$.initPromise = (async () => {
      const logPrefix: string = 'HELMWebEditor: _package.initHELMWebEditor()';
      console.debug(`${logPrefix}, start`);

      console.debug(`${logPrefix}, loadModules(), before`);
      await loadModules();
      console.debug(`${logPrefix}, loadModules(), after`);

      console.debug(`${logPrefix}, end`);
    })();
  }
  return window.helmWebEditor$.initPromise;
}

async function loadModules(): Promise<void> {
  require('../vendor/js-draw-lite');
  await window.jsDraw2$.initPromise;

  // Based on _merge.helm.bat
  require('../helm/helm');
  require('../helm/Interface');
  require('../helm/MonomerColors');
  require('../helm/Monomers');
  await import(/* webpackMode: "eager" */ '../helm/Plugin');
  require('../helm/Chain');
  require('../helm/Layout');
  await import(/* webpackMode: "eager" */ '../helm/IO');
  require('../helm/MonomerExplorer');
  require('../helm/MolViewer');
  require('../helm/Formula');
  // require('./Editor'); // File not found
  require('../helm/ExtinctionCoefficient');
  await import(/* webpackMode: "eager" */ '../helm/App');
  require('../helm/AppToolbar');
  require('../helm/MonomerLibApp');
  require('../helm/RuleSet');
  require('../helm/RuleSetApp');
  require('../helm/Adapter');
}

(async () => {
  await initHELMWebEditor();
})();
