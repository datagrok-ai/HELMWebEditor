import type {
  HelmType, IOrgMonomer, IOrgMonomers, IWebEditorMonomer, PolymerType,
} from '@datagrok-libraries/js-draw-lite/src/types/org';

export type IMolFindResType = {
  b: Bond<HelmType>,
  a0: Atom<HelmType>,
  a1: Atom<HelmType>,
}

export interface IMolViewer {
  molscale: number;

  hide(): void;
  show(e: MouseEvent, type: HelmType, m: any, code: string, ed?: Editor<HelmType>, text?: Atom<HelmType>): void;
  show2(xy: Point, type: HelmType, m: any, code: string, ed: Editor<HelmType>, a: Atom<HelmType>): void;

  findR(m: Mol<HelmType>, r: string): IMolFindResType | null;
  joinMol(m: Mol<HelmType>, r1: string, src: Mol<HelmType>, r2: string, a1?: any, a2?: any): void;
}

export interface IWebEditorHelm {
  setSequence(seq: string, format: string,
    sugar?: string, linker?: string, append?: boolean, separator?: string): boolean;
}

export interface IWebEditorCanvas {
  get helm(): IWebEditorHelm;
  getHelm(ret: boolean): string;

  resize(width: number, height: number): void;
}

export interface IWebEditorAppProperties {
  parent: HTMLElement;
}

export interface IWebEditorSizes {
  get rightwidth(): number;
  get topheight(): number;
  get bottomheight(): number;
}

// export interface IWebEditorApp {
//   notation: HTMLElement;
//   sequence: HTMLElement;
//   properties: IWebEditorAppProperties;
//   get toolbarheight(): number;
//   get canvas(): IWebEditorCanvas;
//   get structureview(): any;
//   get mex(): any;
//
//   calculateSizes(): IWebEditorSizes;
// }

export interface IAppOptions {
  showabout: boolean;
  mexfontsize: string;
  mexrnapinontab: boolean;
  topmargin: number;
  mexmonomerstab: boolean;
  sequenceviewonly: boolean;
  mexfavoritefirst: boolean;
  mexfilter: boolean;

  jsdrawservice: string;
  monomercleanupurl: string;

  rulesurl: string;
  monomersurl: string;
  monomerfun: Function;

  mexfind: boolean;
  width: number;
  height: number;

  validateurl: string;
  canvastoolbar: boolean;
  onValidateHelm: any;
  cleanupurl: string;
  onCleanUpStructure: Function;

  calculatorurl: string;
}

export type AppSizesType = {
  height: number,
  topheight: number,
  bottomheight: number,
  leftwidth: number,
  rightwidth: number,
}

export interface IOrgHelmMonomers extends IOrgMonomers<HelmType> {
  cleanupurl: string | null;

  bases: { [name: string]: string };
  linkers: { [name: string]: string };
  sugars: { [name: string]: string };

  addOneMonomer(monomer: IWebEditorMonomer): void;
  getDefaultMonomer(type: HelmType): string;
  getMolfile(monomer: IWebEditorMonomer): string;
  clear(): void;
  writeOne(m: IWebEditorMonomer): string;
  loadDB(list: any[], makeMon?: Function, clearall?: boolean): void;

  [p: string]: any;
}

export interface IChain {
  atoms: Atom<HelmType>[];
  bonds: Bond<HelmType>[];
  bases: Atom<HelmType>[];
  readonly annotation: string;
  type: PolymerType;

  new(sid: string): IChain;
  new(): IChain;
  getChains(m: Mol<HelmType>, branches: any): any[];
  getAtomByAAID(aid: string): Atom<HelmType>;
}

export type ChainId = string;

export interface ICollection<HelmType> {
  atoms: Atom<HelmType>[];
  bonds: Bond<HelmType>[];
}

export interface IConnection {
  c1: ChainId;
  c2: ChainId;
  ai1: string;
  ai2: string;
  r1: RNote;
  r2: RNote;

  ratio1: number;
  ratio2: number;

  tag: string | null;
  h: any;
}

export interface IConnection2 {
  chain1: string;
  chain2: string;

  a1: string;
  r1: string;

  a2: string;
  r2: string;

  tag?: string;
}

export interface ISequence {

}

export interface IGroup {

}

export interface IRet {
  chains: { [k: ChainId]: IChain };
  connections: IConnection[];
  sequences: { [k: string]: ISequence };
  groups: { [k: string]: IGroup };
  groupatoms: Atom<HelmType>[];
  singletons: { [k: ChainId]: ChainId };
}

export type RNote = string;

export interface IPlugin {
  jsd: IMolHandler<HelmType>;

  // TODO: jsd: any
  new(jsd: IMolHandler<HelmType>): IPlugin;

  addNode(p: Point, biotype: HelmType, elem: string): Atom<HelmType>;
  addBond(a1: Atom<HelmType>, a2: Atom<HelmType>, r1: number, r2: number): Bond<HelmType>;

  groupExpand(a: Atom<HelmType>): void;
  addHydrogenBond(a1: Atom<HelmType>, a2: Atom<HelmType>): void;
}

export interface IHelmMonomer {

}

export interface IAnnotation {
  tag: string;
  repeat: string;
  str: string;
}

export interface IAppendix {
  tag: string;
  str: string;
}

export type IOType = {
  // get kVersion(): string;
  //
  _detachAppendix(s: string, token: string): IAppendix;
  detachAnnotation(s: string): IAnnotation;
  parseConnection(s: string): IConnection2 | null;

  // getHelm<TBio = any>(m: IMol<TBio>, highlightselection: boolean): string | null;
  // getHelm2<TBio = any>(m: IMol<TBio>, highlightselection: boolean, ret: any, groupatom: any): string | null;
  // getGroupHelm<TBio = any>(ret: IRet<TBio>, id: string, a, highlightselection: boolean): void;
  //
  // addConnection<TBio = any>(ret: IRet<TBio>, c1: ChainId, c2: ChainId, a1: IAtom<TBio>, a2: IAtom<TBio>, r1: RNote, r2: RNote, ratio1: number, ratio2: number, tag: string, h: any): void;
  // renderConnection<TBio = any>(ret: IRet<TBio>, conn: IConnection): string;
  // connectionStr(aaid1: string, r1: RNote, aaid2: string, r2: RNote): string;
  // rStr(aaid: string, r: string): string;
  // allBelongToGroup<TBio>(atoms: IAtom<TBio>[], g: AtomGroupType): boolean;
  // getHelmString<TBio = any>(ret: IRet<TBio>, highlightselection: boolean): string;

  // _scanGroup(ret: any, g: any, id: any): void;

  addNode(plugin: IPlugin, chain: IChain, atoms: Atom<HelmType>[], p: Point, type: HelmType, elem: string, renamedmonomers: any): Atom<HelmType>;

  addAAs(plugin: IPlugin, ss: string, chain: IChain, origin: Point, renamedmonomers: any): number;
  addHELMRNAs(plugin: IPlugin, ss: string, chain: IChain, origin: Point, renamedmonomers: any): number;
  addChem(plugin: IPlugin, ss: string, chain: IChain, origin: Point, renamedmonomers: any): number;
  addBlob(plugin: IPlugin, name: string, chain: IChain, origin: Point, renamedmonomers: any, annotation: string): number;

  parseHelm(plugin: IPlugin, s: string, origin: Point, renamedmonomers: any): void;

  getMonomers(m: Mol<HelmType>): { [monomerKey: string]: IHelmMonomer };

  split(s: string, sep: string): string[];

  [p: string]: any;
}

export interface IRule {
  id: number;
  category: string;
  description: string;
  script: string;
}

export interface IRuleSet {
  rules: IRule[];
  loadDB(list: IRule[]): void;

  [p: string]: any;
}

import type {IOrgWebEditor, IOrgInterface} from '@datagrok-libraries/js-draw-lite/src/types/org';
import type {IMolHandler} from '@datagrok-libraries/js-draw-lite/src/types/mol-handler';

import type {Editor} from '@datagrok-libraries/js-draw-lite/src/JSDraw.Editor';
import type {Point} from '@datagrok-libraries/js-draw-lite/src/Point';
import type {Bond} from '@datagrok-libraries/js-draw-lite/src/Bond';
import type {Atom} from '@datagrok-libraries/js-draw-lite/src/Atom';
import type {Mol} from '@datagrok-libraries/js-draw-lite/src/Mol';

import type {MonomerExplorer} from '../../helm/MonomerExplorer';
import type {App} from '../../helm/App';
import type {Interface} from '../../helm/Interface';
import type {Monomers} from '../../helm/Monomers';

export interface IExplorerMonomer extends IOrgMonomer {
  div: HTMLDivElement;
  html: string;
}

/* {
  "showabout": false,
  "mexfontsize": "90%",
  "mexrnapinontab": true,
  "topmargin": 20,
  "mexmonomerstab": true,
  "sequenceviewonly": false,
  "mexfavoritefirst": true,
  "mexfilter": true,
  "width": 290,
  "height": 852
} */
export interface IMonomerExplorerOptions {
  showabout: boolean;
  mexfontsize: string;
  mexrnapinontab: boolean;
  topmargin: number;
  mexmonomerstab: boolean;
  sequenceviewonly: boolean;
  mexfavoritefirst: boolean,
  mexfilter: boolean,
  width: number,
  height: number,
}

export type HweHelmType = HelmType | 'nucleotide';

export type TabDescType = {
  caption: string;
  tabkey: string;
}

export interface IOrgHelmWebEditor extends Omit<IOrgWebEditor<HelmType>, 'Interface' | 'Plugin' | 'Monomers'> {
  ambiguity: boolean;
  kCaseSensitive: boolean;
  defaultbondratio: number;
  bondscale: number;

  MonomerExplorer: typeof MonomerExplorer;
  App: typeof App;
  RuleSetApp: any;
  readonly MolViewer: IMolViewer;
  IO: IOType;

  RuleSet: IRuleSet;

  readonly Chain: IChain;

  Interface: Interface; /* single instance */
  Monomers: Monomers; /* single instance */
  monomers: void;

  monomerTypeList(): { [type: string]: string };

  [p: string]: any;
}

export type OrgHelmType = {
  readonly webeditor: IOrgHelmWebEditor;
}

export type OrgType = {
  helm: OrgHelmType;
}
