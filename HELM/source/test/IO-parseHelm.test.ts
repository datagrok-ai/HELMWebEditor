import {expect} from 'chai';

import {IPoint} from '@datagrok/js-draw-lite/src/types/jsdraw2';

const sum = (a: number, b: number): number => {
  return a + b;
};

describe('adds', () => {
  it('1 + 2 to equal 3', () => {
    expect(sum(1, 2)).equal(3);
  });
});

// import {IOType, IPlugin, OrgType} from '../src/types/org-helm';
// // import {IPlugin, IPoint} from '@datagrok/js-draw-lite/src/types/jsdraw2';
//
// import type {HweWindow} from '../src/types';
// import type {JSDraw2Window} from '@datagrok/js-draw-lite/src/types';
//
// const k = 42;
// require('dojo');
// const l = 11;
// // dojo must be primary loaded before HELMWebEditor dependent on JSDraw2.Lite
// import {initHELMWebEditor} from '../src/package';
//
// declare const window: Window & HweWindow & JSDraw2Window;
// declare const org: OrgType;
//
// describe('IO.parseHelm', () => {
//   let io: IOType;
//   let plugin: IPlugin;
//   let origin: IPoint;
//   let renamedMonomers: any;
//
//   beforeAll(async () => {
//     await initHELMWebEditor();
//     io = org.helm.webeditor.IO;
//     renamedMonomers = null;
//   });
//
//   beforeEach(async () => {
//   });
//
//   it('should parse a simple peptide sequence', () => {
//     const helmString = 'PEPTIDE1{A.A.A}$PEPTIDE1,PEPTIDE1,1:R1-2:R2$$$';
//     io.parseHelm(plugin, helmString, origin, renamedMonomers);
//     expect(origin.y).toBe(4);
//   });
//
//   it('should parse a simple RNA sequence', () => {
//     const helmString = 'RNA1{R(A)P.R(U)P.R(G)P}$RNA1,RNA1,1:R1-2:R2$$$';
//     io.parseHelm(plugin, helmString, origin, renamedMonomers);
//     expect(origin.y).toBe(4);
//   });
//
//   it('should parse a sequence containing connections', () => {
//     const helmString = 'PEPTIDE1{A.A.A}|RNA1{R(A)P.R(U)P.R(G)P}$PEPTIDE1,RNA1,1:R1-2:R2$$$';
//     io.parseHelm(plugin, helmString, origin, renamedMonomers);
//     expect(origin.y).toBe(8);
//   });
//
//   it('should parse a sequence containing groups', () => {
//     const helmString = 'PEPTIDE1{A.A.A}|RNA1{R(A)P.R(U)P.R(G)P}$PEPTIDE1,RNA1,1:R1-2:R2$G1(PEPTIDE1)$$';
//     io.parseHelm(plugin, helmString, origin, renamedMonomers);
//     expect(origin.y).toBe(8);
//   });
//
//   it('should parse a sequence containing hydrogen bonds', () => {
//     const helmString = 'RNA1{R(A)P.R(U)P.R(G)P}$RNA1,RNA1,1:pair-2:pair$$$';
//     io.parseHelm(plugin, helmString, origin, renamedMonomers);
//     expect(origin.y).toBe(4);
//   });
// });
