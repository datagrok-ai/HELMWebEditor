import {AtomGroupType, IAtom, IBond, IMol, IPoint} from '@datagrok/js-draw-lite/src/types/jsdraw2';
import {HelmType, IOrgWebEditorMonomer, PolymerType} from '@datagrok/js-draw-lite/src/types/org';

export interface IMonomer {

}

export interface IMolViewer {
  molscale: number;
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

export interface IApp {
  new(host: HTMLDivElement, options: IAppOptions): IWebEditorApp;
}

export interface IOrgMonomers {
  addOneMonomer(monomer: IMonomer): void;
  getMonomer(a: IAtom<HelmType> | HelmType, elem?: string): IOrgWebEditorMonomer | null;
  getMonomerSet(biotype: string): any;
  clear(): void;
  writeOne(m: IOrgWebEditorMonomer): string;
}

export interface IChain<HelmType> {
  atoms: IAtom<HelmType>[];
  readonly annotation: string;
  type: PolymerType;

  new(sid: string): IChain<HelmType>;
  new(): IChain<HelmType>;
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
  chains: { [k: ChainId]: IChain<HelmType> };
  connections: IConnection[];
  sequences: { [k: string]: ISequence };
  groups: { [k: string]: IGroup };
  groupatoms: IAtom<HelmType>[];
  singletons: { [k: ChainId]: ChainId };
}

export type RNote = string;

export interface IPlugin {
  jsd: any;

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
  parseHelm(plugin: IPlugin, s: string, origin: IPoint, renamedmonomers: any): void;
  parseConnection(s: string): IConnection2 | null;

  getMonomers(m: IMol<HelmType>): { [monomerKey: string]: IHelmMonomer };

  [p: string]: any;
}

import {IOrgWebEditor} from '@datagrok/js-draw-lite/src/types/org';

export interface IOrgHelmWebEditor extends IOrgWebEditor {
  kCaseSensitive: boolean;
  defaultbondratio: number;
  bondscale: number;

  readonly App: IApp;
  readonly MolViewer: IMolViewer;
  IO: IOType;

  readonly Chain: IChain<HelmType>;
  readonly Monomers: IOrgMonomers;

  monomerTypeList(): string[];
}

export type OrgHelmType = {
  readonly webeditor: IOrgHelmWebEditor;
}

export type OrgType = {
  helm: OrgHelmType;
}
