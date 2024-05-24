import {IAtom} from '@datagrok/js-draw-lite/src/types/jsdraw2';

export const enum MonomerTypes {
  BACKBONE = 'Backbone',
  BRANCH = 'Branch',
  TERMINAL = 'Terminal',
}

/** 'Backbone' | 'Branch' | 'Terminal' */
export type MonomerType = `${MonomerTypes}`

export const enum PolymerTypes {
  RNA = 'RNA',
  PEPTIDE = 'PEPTIDE',
  CHEM = 'CHEM',
  BLOB = 'BLOB',
  G = 'G',
}

/** 'RNA' | 'PEPTIDE' | 'CHEM' | 'BLOB' | 'G' */
export type PolymerType = `${PolymerTypes}`

export const enum HelmTypes {
  BASE = 'HELM_BASE',
  SUGAR = 'HELM_SUGAR',
  LINKER = 'HELM_LINKER',
  AA = 'HELM_AA',
  CHEM = 'HELM_CHEM',
  BLOB = 'HELM_BLOB',
  NUCLEOTIDE = 'HELM_NUCLETIDE',
}

/** 'HELM_BASE' | 'HELM_SUGAR' | 'HELM_LINKER' | 'HELM_AA' | 'HELM_CHEM' | 'HELM_BLOB' | 'HELM_NUCLETIDE' */
export type HelmType = `${HelmTypes}`

type IHelmTypes = Record<HelmTypes, OrgHelmType>;

export type WebEditorRGroups = { [group: string]: string };

export type WebEditorMonomer = {
  /** symbol */ id: string;
  /** name */ n?: string;
  /** natural analog */ na?: string;
  /* Pistoia.HELM deletes .type and .mt in Monomers.addOneMonomer() */
  /** polymer type */type?: PolymerType;
  /** monomer type */ mt?: MonomerType;
  /** molfile */ m?: string;
  /** substituents */ at: WebEditorRGroups;
  /** number of substituents */ get rs(): number;
};

export interface IMonomer {

}

export interface IMolViewer {
  molscale: number;
}

export interface IWebEditorIO {
  trimBracket(s: string): string;
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

export interface IMonomers {
  // helm2type(m: WebEditorMonomer): HelmType | null;

  addOneMonomer(monomer: IMonomer): void;
  getMonomer(a: IAtom<HelmType> | HelmType, elem: string | undefined): WebEditorMonomer | null;
  getMonomerSet(biotype: string): any;
  clear(): void;
}

export interface IOrgHelmWebEditor {
  kCaseSensitive: boolean;

  readonly App: IApp;
  readonly Monomers: IMonomers;
  readonly MolViewer: IMolViewer;
  readonly IO: IWebEditorIO;
  readonly HELM: IHelmTypes;

  monomerTypeList(): string[];
}


export type OrgHelmType = {
  readonly webeditor: IOrgHelmWebEditor;
}

export type OrgHelmModuleType = {
  helm: OrgHelmType;
}
