import type {
  HelmType, IOrgMonomer, IOrgMonomers, IWebEditorMonomer, MonomerSetType, PolymerType,
} from '@datagrok-libraries/js-draw-lite/src/types/org';

export type HelmAtom = Atom<HelmType>;
export type HelmBond = Bond<HelmType>;
export type HelmMol = Mol<HelmType>;
export type HelmGroup = Group<HelmType>;
export type HelmBracket = Bracket<HelmType>;

export type HelmEditor = Editor<HelmType, IHelmDrawOptions>;

export type HelmString = string;

export type IMolFindResType = {
  b: Bond<HelmType>,
  a0: Atom<HelmType>,
  a1: Atom<HelmType>,
}

export const enum MonomerNumberingTypes {
  default,
  continuous,
}

export type MonomerNumberingType = typeof MonomerNumberingTypes[keyof typeof MonomerNumberingTypes];

export interface IMolViewer {
  molscale: number;

  hide(): void;
  show(e: MouseEvent, type: HelmType, m: any, code: string, ed?: HelmEditor, text?: Atom<HelmType>): void;
  show2(xy: Point, type: HelmType, m: any, code: string, ed: HelmEditor, a: Atom<HelmType>): void;

  findR(m: Mol<HelmType>, r: string, a?: HelmAtom): IMolFindResType | null;
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

export const enum HelmTabKeys {
  Sequence = 'sequence',
  Helm = 'notation',
  Properties = 'properties',
  StructureView = 'structureview',
}

export type HelmTabKey = typeof HelmTabKeys[keyof typeof HelmTabKeys];

export interface IAppOptions {
  ambiguity: boolean;
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

  // MonomerExplorer
  alwaysdrawnucleotide?: boolean;
  monomerwidth?: number;
  mexuseshape?: any;
  useshape?: any;
  mexfavoritetab?: boolean;
  mexgroupanalogs?: boolean;
  mexusecolor?: boolean;
  currentTabKey?: HelmTabKey;
  overrideTabs: (tabs: Partial<TabDescType>[]) => Partial<TabDescType>[];
  onShowTab: (mex: MonomerExplorer, div: HTMLDivElement, key: string) => void;
}

export interface IMonomerExplorerOptions extends IAppOptions {}

export type AppSizesType = {
  height: number,
  topheight: number,
  bottomheight: number,
  leftwidth: number,
  rightwidth: number,
}

export type GetMonomerResType = IWebEditorMonomer | null;
export type GetMonomerFunc = (a: HelmAtom | HelmType, name?: string) => GetMonomerResType;

export type GetMonomerSetFunc = (a: HelmAtom | HelmType | null) => MonomerSetType | null;

export type MonomersFuncs = {
  getMonomer: GetMonomerFunc,
  getMonomerSet: GetMonomerSetFunc,
}

export interface IOrgHelmMonomers extends IOrgMonomers<HelmType> {
  cleanupurl?: string;

  sugars: MonomerSetType;
  linkers: MonomerSetType;
  bases: MonomerSetType;
  aas: MonomerSetType;
  chems: MonomerSetType;

  addOneMonomer(monomer: IWebEditorMonomer): void;
  getDefaultMonomer(type: HelmType): string;
  getMolfile(monomer: IWebEditorMonomer): string | null | undefined;
  clear(): void;
  writeOne(m: IWebEditorMonomer): string;
  loadDB(list: any[], makeMon?: Function, clearall?: boolean): void;

  [p: string]: any;
}

// export interface IChain {
//   atoms: Atom<HelmType>[];
//   bonds: Bond<HelmType>[];
//   bases: Atom<HelmType>[];
//   annotation: string;
//   type: PolymerType;
//
//   new(sid: string): IChain;
//   new(): IChain;
//   getChains(m: Mol<HelmType>, branches: any): any[];
//   getAtomByAAID(aid: string): Atom<HelmType>;
// }

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

// export interface ISequence {
//
// }
//
// export interface IGroup {
//
// }
//
// export interface IRet {
//   chains: { [k: ChainId]: IChain };
//   connections: IConnection[];
//   sequences: { [k: string]: ISequence };
//   groups: { [k: string]: IGroup };
//   groupatoms: Atom<HelmType>[];
//   singletons: { [k: ChainId]: ChainId };
// }

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

export interface IRule {
  id: number;
  category: string;
  description: string;
  script: string;
}

export interface IRuleSet {
  loadDB(list: IRule[], makeMon?: Function, clearAll?: boolean): void;

  filterRules(...args: any[]): void;
  listRules(...args: any[]): void;
  applyRules(...args: any[]): void;
}

import type {IOrgWebEditor, IOrgInterface} from '@datagrok-libraries/js-draw-lite/src/types/org';
import type {IMolHandler} from '@datagrok-libraries/js-draw-lite/src/types/mol-handler';

import type {Editor} from '@datagrok-libraries/js-draw-lite/src/JSDraw.Editor';
import type {Point} from '@datagrok-libraries/js-draw-lite/src/Point';
import type {Bond} from '@datagrok-libraries/js-draw-lite/src/Bond';
import type {Atom} from '@datagrok-libraries/js-draw-lite/src/Atom';
import type {Mol} from '@datagrok-libraries/js-draw-lite/src/Mol';
import type {Group} from '@datagrok-libraries/js-draw-lite/src/Group';
import type {Bracket} from '@datagrok-libraries/js-draw-lite/src/Bracket';

import type {IO} from '../../helm/IO';
import type {Monomers} from '../../helm/Monomers';
import type {MonomerExplorer} from '../../helm/MonomerExplorer';
import type {App} from '../../helm/App';
import type {Plugin} from '../../helm/Plugin';
import type {Chain} from '../../helm/Chain';
import type {Formula} from '../../helm/Formula';
import type {Interface} from '../../helm/Interface';
import type {MolViewer} from '../../helm/MolViewer';
import type {Layout} from '../../helm/Layout';

import type {ButtonTypes} from '@datagrok-libraries/js-draw-lite/form/Form';
import type {TabDescType} from '@datagrok-libraries/js-draw-lite/form/Tab';
import type {IDrawOptions, IEditorOptions} from '@datagrok-libraries/js-draw-lite/src/types/jsdraw2';

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

export type HweHelmType = HelmType | 'nucleotide';

export interface IHelmDrawOptions extends IDrawOptions {
  monomerNumbering: MonomerNumberingType;
}

export interface IOrgHelmWebEditor extends Omit<IOrgWebEditor<HelmType, IHelmDrawOptions>, 'Interface' | 'Plugin' | 'Monomers' | 'Formula'> {
  ambiguity: boolean;
  kCaseSensitive: boolean;
  defaultbondratio: number;
  bondscale: number;

  MonomerExplorer: typeof MonomerExplorer;
  App: typeof App;
  Plugin: typeof Plugin;
  Chain: typeof Chain;

  RuleSetApp: any;
  MolViewer: MolViewer;
  Layout: Layout;
  IO: IO; /* single instance */

  RuleSet: IRuleSet;

  Formula: Formula;
  Interface: Interface; /* single instance */
  Monomers: Monomers; /* single instance */
  monomers: Monomers; // TODO: Eliminate

  monomerTypeList(): { [type: string]: string };

  [p: string]: any;
}

export type OrgHelmType = {
  readonly webeditor: IOrgHelmWebEditor;
}

export type OrgType = {
  helm: OrgHelmType;
}
