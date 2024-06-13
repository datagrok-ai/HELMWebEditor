import {
  HelmType, IOrgMonomers, IOrgWebEditorMonomer, PolymerType
} from '@datagrok/js-draw-lite/src/types/org';
import {
  AtomGroupType, IAtom, IBond, IEditor, IEditorOptions, IMol, IPoint
} from '@datagrok/js-draw-lite/src/types/jsdraw2';

export interface IMonomer {

}

export type IMolFindResType = {
  b: IBond<HelmType>,
  a0: IAtom<HelmType>,
  a1: IAtom<HelmType>,
}

export interface IMolViewer {
  molscale: number;

  hide(): void;
  show(e: HTMLElement, type: HelmType, m: any, code: string, ed: IEditor<HelmType>, text: IAtom<HelmType>): void;
  show2(xy: IPoint, type: HelmType, m: any, code: string, ed: IEditor<HelmType>, a: IAtom<HelmType>): void;

  findR(m: IMol<HelmType>, r: string): IMolFindResType | null;
  joinMol(m: IMol<HelmType>, r1: string, src: IMol<HelmType>, r2: string, a1?: any, a2?: any): void;
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

export interface IWebEditorApp {
  notation: HTMLElement;
  sequence: HTMLElement;
  properties: IWebEditorAppProperties;
  get toolbarheight(): number;
  get canvas(): IWebEditorCanvas;
  get structureview(): any;
  get mex(): any;

  calculateSizes(): IWebEditorSizes;
}

export interface IAppOptions {
  showabout: boolean;
  mexfontsize: string;
  mexrnapinontab: boolean;
  topmargin: number;
  mexmonomerstab: boolean;
  sequenceviewonly: boolean;
  mexfavoritefirst: boolean;
  mexfilter: boolean;
}

export type AppSizesType = {
  height: number,
  topheight: number,
  bottomheight: number,
  leftwidth: number,
  rightwidth: number,
}

export interface IApp {
  page: IPage;

  new(host: HTMLDivElement, options: IAppOptions): IWebEditorApp;

  init(): void;
  calculateSizes(): AppSizesType;
}

export interface IOrgHelmMonomers extends IOrgMonomers<HelmType> {
  cleanupurl: string | null;

  addOneMonomer(monomer: IMonomer): void;
  getMolfile(monomer: IOrgWebEditorMonomer): string;
  clear(): void;
  writeOne(m: IOrgWebEditorMonomer): string;
  loadDB(list: any[], makeMon?: Function, clearall?: boolean): void;
}

export interface IChain {
  atoms: IAtom<HelmType>[];
  bonds: IBond<HelmType>[];
  bases: IAtom<HelmType>[];
  readonly annotation: string;
  type: PolymerType;

  new(sid: string): IChain;
  new(): IChain;
  getChains(m: IMol<HelmType>, branches: any): any[];
  getAtomByAAID(aid: string): IAtom<HelmType>;
}

export type ChainId = string;

export interface ICollection<HelmType> {
  atoms: IAtom<HelmType>[];
  bonds: IBond<HelmType>[];
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
  groupatoms: IAtom<HelmType>[];
  singletons: { [k: ChainId]: ChainId };
}

export type RNote = string;

export interface IPlugin {
  jsd: IMolHandler<HelmType>;

  // TODO: jsd: any
  new(jsd: IMolHandler<HelmType>): IPlugin;

  addNode(p: IPoint, biotype: HelmType, elem: string): IAtom<HelmType>;
  addBond(a1: IAtom<HelmType>, a2: IAtom<HelmType>, r1: number, r2: number): IBond<HelmType>;

  groupExpand(a: IAtom<HelmType>): void;
  addHydrogenBond(a1: IAtom<HelmType>, a2: IAtom<HelmType>): void;
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

  addNode(plugin: IPlugin, chain: IChain, atoms: IAtom[], p: IPoint, type: HelmType, elem: string, renamedmonomers: any): IAtom<HelmType>;

  addAAs(plugin: IPlugin, ss: string, chain: IChain, origin: IPoint, renamedmonomers: any): number;
  addHELMRNAs(plugin: IPlugin, ss: string, chain: IChain, origin: IPoint, renamedmonomers: any): number;
  addChem(plugin: IPlugin, ss: string, chain: IChain, origin: IPoint, renamedmonomers: any): number;
  addBlob(plugin: IPlugin, name: string, chain: IChain, origin: IPoint, renamedmonomers: any, annotation: string): number;

  parseHelm(plugin: IPlugin, s: string, origin: IPoint, renamedmonomers: any): void;

  getMonomers(m: IMol<HelmType>): { [monomerKey: string]: IHelmMonomer };

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
}

import {IOrgWebEditor, IOrgInterface} from '@datagrok/js-draw-lite/src/types/org';
import {IMolHandler} from '@datagrok/js-draw-lite/src/types/mol-handler';
import {IPage} from '@datagrok/js-draw-lite/src/types/scil';

export interface IOrgHelmInterface extends IOrgInterface {
  createPoint(x: number, y: number): IPoint;
  createMol<TBio>(molfile: string): IMol<TBio>;
  createCanvas<TBio = any>(div: HTMLElement, options?: Partial<IEditorOptions>): IEditor<TBio>;
}


export interface IOrgHelmWebEditor extends IOrgWebEditor<HelmType> {
  ambiguity: boolean;
  kCaseSensitive: boolean;
  defaultbondratio: number;
  bondscale: number;

  Interface: IOrgHelmInterface;
  App: IApp;
  readonly MolViewer: IMolViewer;
  IO: IOType;

  RuleSet: IRuleSet;

  readonly Chain: IChain;
  readonly Monomers: IOrgHelmMonomers;
  readonly Plugin: IPlugin;

  monomerTypeList(): string[];
}

export type OrgHelmType = {
  readonly webeditor: IOrgHelmWebEditor;
}

export type OrgType = {
  helm: OrgHelmType;
}
