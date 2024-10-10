/*******************************************************************************
 * Copyright (C) 2018, The Pistoia Alliance
 * Created by Scilligence, built on JSDraw.Lite
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *******************************************************************************/

import type {JSDraw2ModuleType, ScilModuleType} from '@datagrok-libraries/js-draw-lite/src/types';
import type {HelmType, IOrgInterface} from '@datagrok-libraries/js-draw-lite/src/types/org';
import type {
  HelmAtom, HelmEditor, HelmMol, IHelmDrawOptions, IHelmEditorOptions, IMonomerColors, OrgType
} from '../src/types/org-helm';

import type {Editor} from '@datagrok-libraries/js-draw-lite/src/JSDraw.Editor';
import type {Point} from '@datagrok-libraries/js-draw-lite/src/Point';
import type {Atom} from '@datagrok-libraries/js-draw-lite/src/Atom';
import type {Rect} from '@datagrok-libraries/js-draw-lite/src/Rect';
import type {Mol} from '@datagrok-libraries/js-draw-lite/src/Mol';
import type {Bond} from '@datagrok-libraries/js-draw-lite/src/Bond';
import type {
  BondType, IEditorOptions, DrawStep, IDrawOptions
} from '@datagrok-libraries/js-draw-lite/src/types/jsdraw2';

import {DrawSteps} from '@datagrok-libraries/js-draw-lite/src/types/jsdraw2';
import {MonomerNumberingTypes} from '../src/types/org-helm';

declare const JSDraw2: JSDraw2ModuleType;
declare const scil: ScilModuleType;
declare const org: OrgType;
declare const JSDrawServices: any;

export interface ToolbarButtonDescType {
  /** command */ c: string;
  /** Text */ t?: string;
  label?: string;
  sub?: any;
  hidden?: boolean;
}

/**
 * Interface class
 * @class org.helm.webeditor.Interface
 */
export class Interface implements IOrgInterface<HelmType, IHelmEditorOptions> {
  /**
   * Create the canvas
   * @function createCanvas
   * @param {DOM} div
   * @param {dict} args - check <a href='http://www.scilligence.com/sdk/jsdraw/logical/scilligence/JSDraw2/Editor.html'>JSDraw SDK</a>
   */
  createCanvas(div: HTMLDivElement, args: Partial<IEditorOptions>): HelmEditor {
    return new JSDraw2.Editor<HelmType, IHelmEditorOptions>(div, args);
  }

  /**
   * Create a molecule object
   * @function createMol
   * @param {string} molfile
   */
  createMol(molfile: string): Mol<HelmType> {
    const m = new JSDraw2.Mol();
    m.setMolfile(molfile);
    return m;
  }

  /**
   * Create a point
   * @function createPoint
   * @param {number} x
   * @param {number} y
   */
  createPoint(x: number, y: number): Point {
    return new JSDraw2.Point(x, y);
  }

  /**
   * Create a rectangle object
   * @function createRect
   * @param {number} l - left
   * @param {number} t - top
   * @param {number} w - width
   * @param {number} h - height
   */
  createRect(l: number, t: number, w: number, h: number): Rect {
    return new JSDraw2.Rect(l, t, w, h);
  }

  /**
   * Create an atom
   * @function createAtom
   * @param {JSDraw2.Mol} m
   * @param {JSDraw2.Point} p - the coordinate
   */
  createAtom(m: HelmMol, p: Point): HelmAtom | null {
    return m.addAtom(new JSDraw2.Atom<HelmType>(p));
  }

  /**
   * Create a bond between two atoms
   * @function createBond
   * @param {JSDraw2.Mol} m
   * @param {JSDraw2.Atom} a1
   * @param {JSDraw2.Atom} a2
   */
  createBond(m: Mol<HelmType>, a1: Atom<HelmType>, a2: Atom<HelmType>, bondtype?: BondType): Bond<HelmType> | null {
    return m.addBond(new JSDraw2.Bond<HelmType>(a1, a2, bondtype == null ? JSDraw2.BONDTYPES.SINGLE : bondtype));
  }

  /**
   * Get atom counts
   * @function getAtomStats
   * @param {JSDraw2.Mol} m
   * @param {array} atoms
   */
  getAtomStats(m: Mol<HelmType>, atoms: Atom<HelmType>[]) {
    const mol = {atoms: atoms, bonds: m.bonds};
    const ret = JSDraw2.FormulaParser.getAtomStats(m);
    return ret == null ? null : ret.elements;
  }

  /**
   * Test if two molecules are equal
   * @function molEquals
   * @param {JSDraw2.Mol} m1
   * @param {JSDraw2.Mol} m2
   */
  molEquals(m1: any, m2: any) {
    const mol1 = m1.mol != null ? m1.mol : (m1.mol = this.createMol(scil.helm.Monomers.getMolfile(m1)));
    const mol2 = m2.mol != null ? m2.mol : (m2.mol = this.createMol(scil.helm.Monomers.getMolfile(m2)));
    return mol2.fullstructureMatch(mol1);
  }

  /**
   * count atoms and bonds to calculate MF and MW
   * @function molStats
   * @param {string} molfile
   */
  molStats(molfile: string) {
    const mol = this.createMol(molfile);
    mol.calcHCount();
    return JSDraw2.FormulaParser.getAtomStats(mol).elements;
  }

  /**
   * Get element mass
   * @function getElementMass
   * @param {string} e - element name
   */
  getElementMass(e: string): number {
    return JSDraw2.PT[e].m;
  }

  /**
   * Get the current object
   * @function getCurrentAtom
   * @param {JSDraw2.Editor} jsd - JSDraw Editor
   */
  getCurrentAtom(jsd: HelmEditor): HelmAtom | null {
    return JSDraw2.Atom.cast(jsd.curObject);
  }

  /**
   * Scale the canvas
   * @function scaleCanvas
   * @param {JSDraw2.Editor} jsd - JSDraw Editor
   */
  scaleCanvas(jsd: HelmEditor): void {
    const scale = JSDraw2.Editor.BONDLENGTH / jsd.bondlength;
    if (JSDraw2.Editor.BONDLENGTH / jsd.bondlength > 1)
      jsd.scale(JSDraw2.Editor.BONDLENGTH / jsd.bondlength);
  }

  /**
   * called by the canvas to draw a monomer
   * @function drawMonomer
   * @param {SVG} surface
   * @param {JSDraw2.Atom} a - monomer object
   * @param {JSDraw2.Point} p - coordinate
   * @param {number} fontsize
   * @param {number} linewidth
   * @param {string} color
   */
  drawMonomer(surface: any, a: Atom<HelmType>, p: Point, drawOpts: IHelmDrawOptions, color: any,
    drawStep: DrawStep
  ): void {
    if (a.hidden)
      return;

    const fontsize: number = drawOpts.fontsize;
    const linewidth: number = drawOpts.linewidth;

    color = null;
    const biotype: HelmType = a.biotype()!;
    const c: IMonomerColors = !scil.Utils.isNullOrEmpty(color) ? color :
      drawOpts.getMonomer ? drawOpts.getMonomer(biotype, a.elem) :
        org.helm.webeditor.Monomers.getColor(a);
    const w = fontsize * org.helm.webeditor.atomscale;
    const lw = linewidth / 2; //(c.nature ? 1 : 2);

    const rect = org.helm.webeditor.Interface.createRect(p.x - w / 2, p.y - w / 2, w, w);
    if (DrawSteps.highlight === drawStep && a.highlighted) {
      const hlLW = lw + 7;
      const hlColor = '#FFB2B2';
      if (biotype == org.helm.webeditor.HELM.LINKER)
        JSDraw2.Drawer.drawEllipse(surface, rect, hlColor, hlLW).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.SUGAR)
        JSDraw2.Drawer.drawRect(surface, rect, hlColor, hlLW, linewidth * 3).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.BASE)
        JSDraw2.Drawer.drawDiamond(surface, rect, hlColor, hlLW).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.AA) {
        JSDraw2.Drawer.drawHexgon(surface, rect, hlColor, hlLW).setFill(c.backgroundcolor);
      } else if (biotype == org.helm.webeditor.HELM.CHEM)
        JSDraw2.Drawer.drawRect(surface, rect, hlColor, hlLW, linewidth * 3).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.BLOB)
        JSDraw2.Drawer.drawRect(surface, rect, hlColor, hlLW * 2, linewidth * 5).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.NUCLEOTIDE)
        JSDraw2.Drawer.drawPentagon(surface, rect, hlColor, hlLW).setFill(c.backgroundcolor);
    } else if (DrawSteps.select === drawStep && a.selected) {
      const selLW = lw + 9;
      // const selColor = '#F8F8DD';
      const selColor = '#FFD29B';
      const rect = org.helm.webeditor.Interface.createRect(p.x - w / 2, p.y - w / 2, w, w);
      if (biotype == org.helm.webeditor.HELM.LINKER)
        JSDraw2.Drawer.drawEllipse(surface, rect, selColor, selLW).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.SUGAR)
        JSDraw2.Drawer.drawRect(surface, rect, selColor, selLW, linewidth * 3).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.BASE)
        JSDraw2.Drawer.drawDiamond(surface, rect, selColor, selLW).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.AA) {
        JSDraw2.Drawer.drawHexgon(surface, rect, selColor, selLW).setFill(c.backgroundcolor);
      } else if (biotype == org.helm.webeditor.HELM.CHEM)
        JSDraw2.Drawer.drawRect(surface, rect, selColor, selLW, linewidth * 3).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.BLOB)
        JSDraw2.Drawer.drawRect(surface, rect, selColor, selLW * 2, linewidth * 5).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.NUCLEOTIDE)
        JSDraw2.Drawer.drawPentagon(surface, rect, selColor, selLW).setFill(c.backgroundcolor);
    } else if (DrawSteps.main === drawStep) {
      if (biotype == org.helm.webeditor.HELM.LINKER)
        JSDraw2.Drawer.drawEllipse(surface, rect, c.linecolor, lw).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.SUGAR)
        JSDraw2.Drawer.drawRect(surface, rect, c.linecolor, lw, linewidth * 3).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.BASE)
        JSDraw2.Drawer.drawDiamond(surface, rect, c.linecolor, lw).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.AA) {
        JSDraw2.Drawer.drawHexgon(surface, rect, c.linecolor, lw).setFill(c.backgroundcolor);
      } else if (biotype == org.helm.webeditor.HELM.CHEM)
        JSDraw2.Drawer.drawRect(surface, rect, c.linecolor, lw, linewidth * 3).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.BLOB)
        JSDraw2.Drawer.drawRect(surface, rect, c.linecolor, lw * 2, linewidth * 5).setFill(c.backgroundcolor);
      else if (biotype == org.helm.webeditor.HELM.NUCLEOTIDE)
        JSDraw2.Drawer.drawPentagon(surface, rect, c.linecolor, lw).setFill(c.backgroundcolor);
    }

    if (DrawSteps.main !== drawStep) return;
    const pt = p.clone();
    p.offset(0, -1);
    JSDraw2.Drawer.drawLabel(surface, p, a.elem, c.textcolor, fontsize * (a.elem.length > 1 ? 2 / a.elem.length : 1.0), null, null, null, false);

    if ((a.bio!.id as number) > 0) {
      const p1 = p.clone();
      p1.offset(-fontsize * 1.2, -fontsize * 1.2);
      if (drawOpts.monomerNumbering == null || drawOpts.monomerNumbering === MonomerNumberingTypes.default) {
        JSDraw2.Drawer.drawLabel(surface, p1, a.bio!.id as string, "#00FF00", drawOpts.fontsize, null, null, null, false);
      } else if (drawOpts.monomerNumbering === MonomerNumberingTypes.continuous) {
        JSDraw2.Drawer.drawLabel(surface, p1, a.bio!.continuousId as string, "#00FF00", drawOpts.fontsize, null, null, null, false);
      }
    }
    if (!scil.Utils.isNullOrEmpty(a.bio!.annotation)) {
      const p1 = p.clone();
      const s = a.bio!.annotation!;
      if (a.bio!.annotationshowright) {
        const c: number = a.biotype() == org.helm.webeditor.HELM.AA ? 0.7 : 1;
        p1.offset(fontsize * c, -fontsize * 1.5);
        JSDraw2.Drawer.drawLabel(surface, p1, s, "#FFA500", fontsize, null, "start", null, false);
      } else {
        const c: number = a.biotype() == org.helm.webeditor.HELM.AA ? 1.5 : 1;
        p1.offset(-fontsize * c, -fontsize * 1.5);
        JSDraw2.Drawer.drawLabel(surface, p1, s, "#FFA500", fontsize, null, "end", null, false);
      }
    }

    if (!scil.Utils.isNullOrEmpty(a.tag)) {
      var r = fontsize / 2;
      JSDraw2.Drawer.drawEllipse(surface, org.helm.webeditor.Interface.createRect(pt.x + r / 2, pt.y - w / 3 - r / 2, r, r), "white", lw).setFill("red");
    }
  }

  addToolbar(buttons: ToolbarButtonDescType[], flat: boolean, sub: any, options: any) {
    sub = [
      {c: "helm_base", t: "Base", label: "Base"},
      {c: "helm_sugar", t: "Sugar", label: "Sugar"},
      {c: "helm_linker", t: "Linker", label: "Linker"},
      {c: "helm_aa", t: "Peptide", label: "Peptide"},
      {c: "helm_chem", t: "Chemistry", label: "Chemistry"}
    ];

    const main: ToolbarButtonDescType = {c: "helm_nucleotide", t: "Nucleotide", label: "Nucleotide", sub: sub, hidden: true};
    buttons.push(main);

    buttons.push({c: "new", t: "New", label: "New"});
    if (typeof (JSDrawServices) != "undefined" && JSDrawServices.url != null) {
      buttons.push({c: "open", t: "Load", label: "Load"});
      buttons.push({c: "save", t: "Save", label: "Save"});
    }
    buttons.push({c: "|"});
  }

  /**
   * called when the canvas is creating toolbar
   * @function getHelmToolbar
   * @param {array} buttons
   * @param {array} filesubmenus
   * @param {array} selecttools
   * @param {dict} options
   */
  getHelmToolbar(buttons: ToolbarButtonDescType[], filesubmenus: any[], selecttools: any[], options: {}) {
    this.addToolbar(buttons, true, null, options);

    if (org.helm.webeditor.ambiguity) {
      buttons.push({c: "helm_blob", t: "BLOB", label: "BLOB"});
      buttons.push({c: "bracket", t: "Bracket", label: "Bracket"});
    }
    buttons.push({c: "single", t: "Single bond", label: "Single"});
    buttons.push({c: "|"});

    buttons.push({c: "undo", t: "Undo", label: "Undo"});
    buttons.push({c: "redo", t: "Redo", label: "Redo"});
    buttons.push({c: "|"});

    buttons.push({c: "eraser", t: "Eraser", label: "Eraser"});
    buttons.push({c: "|"});
    buttons.push({c: "select", t: "Box Selection", label: "Select", sub: selecttools});
    buttons.push({c: "|"});
    buttons.push({c: "helm_find", t: "Find/Replace", label: "Find/Replace"});
    buttons.push({c: "helm_layout", t: "Clean", label: "Clean"});
    buttons.push({c: "|"});
    buttons.push({c: "zoomin", t: "Zoom in", label: "Zoom"});
    buttons.push({c: "zoomout", t: "Zoom out", label: "Zoom"});
    buttons.push({c: "|"});
    buttons.push({c: "center", t: "Move to center", label: "Center"});
    buttons.push({c: "moveview", t: "Move/View", label: "Move"});
  }

  /**
   * called when the canvas is trying to display context menu
   * @function onContextMenu
   * @param {JSDraw2.Editor} ed - JSDraw Editor
   * @param {Event} e - Javascript event
   * @param {bool} viewonly - indicate if this is viewonly mode
   */
  onContextMenu(ed: HelmEditor, e: Event, viewonly: boolean): any[] {
    const items = [];

    if (ed.options.helmtoolbar) {
      const a = JSDraw2.Atom.cast(ed.curObject);
      const b = JSDraw2.Bond.cast(ed.curObject);
      const grp = JSDraw2.Group.cast(ed.curObject);
      if (a != null) {
        const biotype = a.biotype();
        if (biotype == scil.helm.HELM.SUGAR && a.bio != null) {
          items.push({caption: "Set as Sense", key: "helm_set_sense"});
          items.push({caption: "Set as Antisense", key: "helm_set_antisense"});
          items.push({caption: "Clear Annotation", key: "helm_set_clear"});
          items.push("-");
          items.push({caption: "Create Complementary Strand", key: "helm_complementary_strand"});
        }

        if (a.superatom != null) {
          if (items.length > 0)
            items.push("-");
          items.push({caption: "Expand"});
        }

        if (org.helm.webeditor.ambiguity && org.helm.webeditor.isHelmNode(biotype) && a.superatom == null) {
          if (items.length > 0)
            items.push("-");
          if (biotype == org.helm.webeditor.HELM.BLOB)
            items.push({caption: "Blob Type", callback: function(cmd: string, obj: Atom<HelmType>) { ed.helm!.setHelmBlobType(obj, cmd); }, children: org.helm.webeditor.blobtypes});
          else if (a.group == null)
            items.push({caption: "Create Group", key: "helm_create_group"});
          items.push("-");
          items.push({caption: "Set Monomer Attributes", key: "helm_atom_prop"});
        }
      } else if (b != null && (b.a1.biotype() == org.helm.webeditor.HELM.BLOB || b.a2.biotype() == org.helm.webeditor.HELM.BLOB)) {
        items.push({caption: "Set Bond Attributes", key: "helm_bond_prop"});
      } else if (grp != null) {
        items.push({caption: "Create Group", key: "helm_create_group"});
        items.push("-");
        items.push({caption: "Collapse", key: "helm_group_collapse"});
        items.push("-");
        items.push({caption: "Set Attributes", key: "group_setproperties"});
      }
    } else {
      const a = JSDraw2.Atom.cast(ed.curObject);
      if (a != null && a.bio == null)
        items.push({caption: "R Group", callback: function(cmd: string, obj: any) { ed.menuSetAtomType(cmd, obj); }, children: ["R1", "R2", "R3", "R4", "R5"]});

      items.push({caption: "Copy Molfile", key: "copymolfile"});
    }

    const br = JSDraw2.Bracket.cast(ed.curObject);
    if (br != null)
      items.push({caption: "Set Subscript", key: "setbracketsubscription"});

    if (items.length > 0)
      items.push("-");

    if (ed.options.helmtoolbar) {
      //items.push({ caption: "About HELM Web Editor", key: "abouthelm" });
    } else
      items.push({caption: "About JSDraw", key: "about"});
    return items;
  }
}

org.helm.webeditor.Interface = new Interface();
