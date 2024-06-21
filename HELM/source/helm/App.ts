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

// @ts-nocheck

import type {DojoType} from '@datagrok-libraries/js-draw-lite/src/types/dojo';

import type {JSDraw2ModuleType, ScilModuleType} from '@datagrok-libraries/js-draw-lite/src/types';
import type {IAppOptions, OrgType} from '../src/types/org-helm';
import type {IPageForm, Page} from '@datagrok-libraries/js-draw-lite/page/Page';
import type {PageTab} from '@datagrok-libraries/js-draw-lite/page/Page.Tab';
import type {MonomerExplorer} from './MonomerExplorer';
import type {HelmType} from '@datagrok-libraries/js-draw-lite/src/types/org';
import type {Mol} from '@datagrok-libraries/js-draw-lite/src/Mol';
import type {Form} from '@datagrok-libraries/js-draw-lite/form/Form';
import type {Editor} from '@datagrok-libraries/js-draw-lite/src/JSDraw.Editor';
import type {Bond} from '@datagrok-libraries/js-draw-lite/src/Bond';

declare const dojo: DojoType;
declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType<HelmType>;
declare const org: OrgType;
declare let JSDrawServices: any;

/**
 * HELM Editor App class
 * @class org.helm.webeditor.App
 */
export class App {
  /**
   @property {MonomerExplorer} mex - Monomer Explorer
   **/
  /**
   @property {JSDraw2.Editor} canvas - Drawing Canvas
   **/
  /**
   @property {DIV} notation - HELM Notation
   **/
  /**
   @property {DIV} sequence - Biological Sequence
   **/
  /**
   @property {scil.Form} properties - HELM Property Table
   **/
  /**
   @property {JSDraw2.Editor} structureview - Structure Viewer
   **/

  private readonly T: string;
  private readonly options: Partial<IAppOptions>;
  public readonly toolbarheight: number;
  public mex: MonomerExplorer;
  public canvas: any;
  public sequence: any;
  public notation: HTMLElement;
  public properties: Form;
  public structureview: Editor;
  private page: Page;
  private treediv: HTMLDivElement;
  private handle: HTMLDivElement;
  private canvasform: IPageForm;
  private sequencebuttons: any[];
  private tabs: PageTab;


  /**
   * @constructor App
   * @param {DOM} parent - The parent element to host the Editor App
   * @param {dict} options - options on how to render the App
   * <pre>
   * mexfontsize: {string} Monomer Explorer font size, e.g. "90%"
   * mexrnapinontab: {bool} show RNA pin icon on its tab on Monomer Explorer
   * mexmonomerstab: {bool} show Monomers tab on Monomer Explorer
   * mexfavoritefirst: {bool} display favorite items first on Monomer Explorer
   * mexfilter: {bool} display Filter box on Monomer Explorer
   * sequenceviewonly: {bool} show Sequence View in viewonly mode
   * showabout: {bool} show about button
   * topmargin: {number} top margin
   * calculatorurl: {string} ajax web service url to calculate properties
   * cleanupurl: {string} ajax web service url to clean up structures
   * monomersurl: {string} ajax web service url to load all monomers
   * rulesurl: {string} ajax web service url to load all rules
   *
   * <b>Example:</b>
   *    &lt;div id="div1" style="margin: 5px; margin-top: 15px"&gt;&lt;/div&gt;
   *    &lt;script type="text/javascript"&gt;
   *     scil.ready(function () {
   *         var app = new scil.helm.App("div1", { showabout: false, mexfontsize: "90%", mexrnapinontab: true,
   *             topmargin: 20, mexmonomerstab: true, sequenceviewonly: false, mexfavoritefirst: true, mexfilter: true });
   *     });
   *    &lt;/script&gt;
   * </pre>
   **/
  constructor(parent: HTMLElement | string, options) {
    this.T = "APP";
    this.toolbarheight = 30;

    if (typeof (parent) == "string")
      parent = scil.byId(parent);
    this.mex = null;
    this.canvas = null;
    this.sequence = null;
    this.notation = null;
    this.properties = null;
    this.structureview = null;

    this.options = options == null ? {} : options;

    if (options.ambiguity != null)
      org.helm.webeditor.ambiguity = options.ambiguity;
    if (!scil.Utils.isNullOrEmpty(this.options.jsdrawservice))
      JSDrawServices = {url: this.options.jsdrawservice};

    if (this.options.monomercleanupurl != null && org.helm.webeditor.Monomers.cleanupurl == null)
      org.helm.webeditor.Monomers.cleanupurl = this.options.monomercleanupurl;

    if (this.options.rulesurl != null) {
      scil.Utils.ajax(this.options.rulesurl, function(ret) {
        if (ret.rules != null)
          ret = ret.rules;
        org.helm.webeditor.RuleSet.loadDB(ret);
      });
    }

    if (this.options.monomersurl != null) {
      const me = this;
      scil.Utils.ajax(this.options.monomersurl, function(ret) {
        if (ret.monomers != null)
          ret = ret.monomers;
        org.helm.webeditor.Monomers.loadDB(ret, me.options.monomerfun);
        me.init(parent);
      });
    } else {
      this.init(parent);
    }
  };

  /**
   * Calculate layout sizes (internal use)
   * @function calculateSizes
   */
  calculateSizes() {
    const d = dojo.window.getBox();
    if (this.options.topmargin > 0)
      d.h -= this.options.topmargin;

    let leftwidth = 0;
    if (this.page != null && this.page.explorer != null && this.page.explorer.left != null)
      leftwidth = this.page.explorer.left.offsetWidth;
    if (!(leftwidth > 0))
      leftwidth = 300;

    const ret = {height: 0, topheight: 0, bottomheight: 0, leftwidth: 0, rightwidth: 0};
    ret.height = d.h - 90 - (this.options.mexfilter != false ? 30 : 0) - (this.options.mexfind ? 60 : 0);
    ret.leftwidth = leftwidth;
    ret.rightwidth = d.w - leftwidth - 25;
    ret.topheight = d.h * 0.7;
    ret.bottomheight = d.h - ret.topheight - 130;

    return ret;
  }

  /**
   * Intialize the App (internal use)
   * @function init
   */
  init(parent) {
    const me = this;
    const sizes = this.calculateSizes();

    const tree = {
      caption: this.options.topmargin > 0 ? null : "Palette",
      marginBottom: "2px",
      marginTop: this.options.topmargin > 0 ? "17px" : null,
      onresizetree: function(width) { me.resizeWindow(); },
      onrender: function(div) {
        me.treediv = div;
        me.createPalette(div, sizes.leftwidth - 10, sizes.height);
      }
    };
    this.page = new scil.Page(parent, tree, {resizable: true, leftwidth: sizes.leftwidth});
    scil.Utils.unselectable(this.page.explorer.left);

    const control = this.page.addDiv();
    const sel = scil.Utils.createSelect(control, ["Detailed Sequence", "Sequence"], "Detailed Sequence", null, {border: "none"});
    scil.connect(sel, "onchange", function() { me.swapCanvasSequence(); });

    this.canvasform = this.page.addForm({
      //caption: "Canvas",
      type: "custom",
      marginBottom: "2px",
      oncreate: function(div) { me.createCanvas(div, sizes.rightwidth, sizes.topheight); }
    });

    this.handle = this.page.addResizeHandle(function(delta) { return me.onresize(delta); }, 8);

    this.sequencebuttons = [
      {label: "Format", type: "select", items: ["", "RNA", "Peptide"], key: "format"},
      {src: scil.Utils.imgSrc("img/moveup.gif"), label: "Apply", title: "Apply Sequence", onclick: function() { me.updateCanvas("sequence", false); }},
      {src: scil.Utils.imgSrc("img/add.gif"), label: "Append", title: "Append Sequence", onclick: function() { me.updateCanvas("sequence", true); }}
    ];

    this.tabs = this.page.addTabs({marginBottom: "2px", onShowTab: function() { me.updateProperties(); }});
    this.tabs.addForm({
      caption: "Sequence",
      type: "custom",
      tabkey: "sequence",
      buttons: this.options.sequenceviewonly ? null : this.sequencebuttons,
      oncreate: function(div) { me.createSequence(div, sizes.rightwidth, sizes.bottomheight); }
    });

    this.tabs.addForm({
      caption: "HELM",
      type: "custom",
      tabkey: "notation",
      buttons: this.options.sequenceviewonly ? null : [
        {src: scil.Utils.imgSrc("img/moveup.gif"), label: "Apply", title: "Apply HELM Notation", onclick: function() { me.updateCanvas("notation", false); }},
        {src: scil.Utils.imgSrc("img/add.gif"), label: "Append", title: "Append HELM Notation", onclick: function() { me.updateCanvas("notation", true); }},
        {src: scil.Utils.imgSrc("img/tick.gif"), label: "Validate", title: "Validate HELM Notation", onclick: function() { me.validateHelm(); }}
      ],
      oncreate: function(div) { me.createNotation(div, sizes.rightwidth, sizes.bottomheight); }
    });

    this.tabs.addForm({
      caption: "Properties",
      type: "custom",
      tabkey: "properties",
      oncreate: function(div) { me.createProperties(div, sizes.rightwidth, sizes.bottomheight); }
    });

    this.tabs.addForm({
      caption: "Structure View",
      type: "custom",
      tabkey: "structureview",
      oncreate: function(div) { me.createStructureView(div, sizes.rightwidth, sizes.bottomheight); }
    });

    scil.connect(window, "onresize", function(e) { me.resizeWindow(); });
  }

  validateHelm() {
    if (this.options.onValidateHelm != null) {
      this.options.onValidateHelm(this);
      return;
    }

    const url = this.options.validateurl;
    if (scil.Utils.isNullOrEmpty(url)) {
      scil.Utils.alert("The validation url is not configured yet");
      return;
    }

    this.setNotationBackgroundColor("white");
    const helm = scil.Utils.getInnerText(this.notation);
    if (scil.Utils.isNullOrEmpty(helm))
      return;

    const me = this;
    scil.Utils.ajax(url, function(ret) {
      me.setNotationBackgroundColor(ret.valid ? "#9fc" : "#fcf");
    }, {helm: helm});
  }

  /**
   * Resize Window (internal use)
   * @function resizeWindow
   */
  resizeWindow() {
    const sizes = this.calculateSizes();
    this.canvas.resize(sizes.rightwidth, sizes.topheight - 70);

    let s = {width: sizes.rightwidth + "px", height: sizes.bottomheight + "px"};
    scil.apply(this.sequence.style, s);
    scil.apply(this.notation.style, s);

    s = {width: sizes.rightwidth + "px", height: (sizes.bottomheight + this.toolbarheight) + "px"};
    scil.apply(this.properties.parent.style, s);

    this.structureview.resize(sizes.rightwidth, sizes.bottomheight + this.toolbarheight);

    this.mex.resize(sizes.height);
  }

  /**
   * Swap canvas and sequence view (internal use)
   * @function swapCanvasSequence
   */
  swapCanvasSequence() {
    const a = this.canvasform.form.dom;
    const h = this.handle;
    const b = this.tabs.tabs.dom;
    if (h.nextSibling == b) {
      a.parentNode.insertBefore(b, a);
      a.parentNode.insertBefore(h, a);
    } else {
      a.parentNode.insertBefore(b, a.nextSibling);
      a.parentNode.insertBefore(h, a.nextSibling);
    }
  }

  /**
   * Event handler when change window size (internal use)
   * @function onresize
   */
  onresize(delta) {
    if (this.handle.nextSibling == this.tabs.tabs.dom) {
      const top = this.canvas.dimension.y;
      const bottom = scil.Utils.parsePixel(this.sequence.style.height);
      if (top + delta > 80 && bottom - delta > 20) {
        this.canvas.resize(0, top + delta);
        this.sequence.style.height = (bottom - delta) + "px";
        this.notation.style.height = (bottom - delta) + "px";
        this.properties.parent.style.height = (bottom - delta) + "px";
        this.structureview.resize(0, bottom - delta);
        return true;
      }
    } else {
      const top = scil.Utils.parsePixel(this.sequence.style.height);
      const bottom = this.canvas.dimension.y;
      if (top + delta > 20 && bottom - delta > 80) {
        this.sequence.style.height = (top + delta) + "px";
        this.notation.style.height = (top + delta) + "px";
        this.properties.parent.style.height = (top + delta) + "px";
        this.structureview.resize(0, top + delta);
        this.canvas.resize(0, bottom - delta);
        return true;
      }
    }
    return false;
  }

  /**
   * create monomer explorer (internal use)
   * @function createPalette
   */
  createPalette(div, width, height) {
    const opt = scil.clone(this.options);
    opt.width = width;
    opt.height = height;
    this.mex = new org.helm.webeditor.MonomerExplorer(div, null, opt);
  }

  /**
   * create drawing canvas (internal use)
   * @function createCanvas
   */
  createCanvas(div, width, height) {
    div.style.border = "solid 1px #eee";

    const me = this;
    const args = {
      skin: "w8", showabout: this.options.showabout, showtoolbar: this.options.canvastoolbar != false, helmtoolbar: true, showmonomerexplorer: true,
      inktools: false, width: width, height: height, ondatachange: function() { me.updateProperties(); },
      onselectionchanged: function() { me.onselectionchanged(); },
      onselectcurrent: function(e, obj, ed) { me.onselectcurrent(e, obj, ed); },
      onvalidatetext: function(s, editor) { return me.onvalidatetext(s, editor); }
    };

    this.canvas = org.helm.webeditor.Interface.createCanvas(div, args);
    this.canvas.helm.monomerexplorer = this.mex;
    this.mex.plugin = this.canvas.helm; // TODO: ?

    this.canvas._testdeactivation = function(e, ed) {
      const src = e.target || e.srcElement;
      return scil.Utils.hasAnsestor(src, me.canvas.helm.monomerexplorer.div);
    };
  }

  onvalidatetext(s, editor) {
    if (scil.Utils.isNullOrEmpty(s))
      return;

    const t = editor.text;
    if (t != null && t.fieldtype == "BRACKET_TYPE" && t.anchors.length == 1 && JSDraw2.Bracket.cast(t.anchors[0]) != null) {
      if (!/^[*]|([0-9]+([-][0-9]+)?)$/.test(s)) {
        scil.Utils.alert("Invalid subscript");
        return false;
      }
    }
  }

  /**
   * Event handler when selecting an object (internal use)
   * @function onselectcurrent
   */
  onselectcurrent(e, obj, ed) {
    const a = JSDraw2.Atom.cast<HelmType>(obj);
    if (a == null || ed.start != null || ed.contextmenu != null && ed.contextmenu.isVisible()) {
      org.helm.webeditor.MolViewer.hide();
      return;
    }
    const type: HelmType | null = a == null ? null : a.biotype();
    const set = org.helm.webeditor.Monomers.getMonomerSet(type);
    const s = a == null ? null : a.elem;
    const m = set == null ? null : set[scil.helm.symbolCase(s)];
    if (m != null && m.m == "" && a != null && a.superatom != null)
      m.m = a.superatom.getXml();

    org.helm.webeditor.MolViewer.show(e, type, m, s, ed, a);
  }

  /**
   * Create sequence view (internal use)
   * @function createSequence
   */
  createSequence(div, width, height) {
    const atts: any = {};
    if (!this.options.sequenceviewonly) {
      atts.contenteditable = "true";
      atts.spellcheck = "false";
    }
    this.sequence = scil.Utils.createElement(div, "div", null, {width: width, height: height, overflowY: "scroll", wordBreak: "break-all"}, atts);
  }

  /**
   * create notation view (internal use)
   * @function createNotation
   */
  createNotation(div, width, height) {
    const atts: any = {};
    if (!this.options.sequenceviewonly) {
      atts.contenteditable = "true";
      atts.spellcheck = "false";
    }
    this.notation = scil.Utils.createElement(div, "div", null, {width: width, height: height, overflowY: "scroll", wordBreak: "break-all"}, atts);
  }

  /**
   * Create property window (internal use)
   * @function createProperties
   */
  createProperties(div, width, height) {
    const d = scil.Utils.createElement(div, "div", null, {width: width, overflow: "scroll", height: height + this.toolbarheight});

    const fields = {
      mw: {label: "Molecular Weight"},
      mf: {label: "Molecular Formula"},
      ec: {label: "Extinction Coefficient"}
    };
    this.properties = new scil.Form({viewonly: true});
    this.properties.render(d, fields, {immediately: true});
  }

  /**
   * Create structure view (internal use)
   * @function createStructureView
   */
  createStructureView(div, width, height) {
    const d = scil.Utils.createElement(div, "div", null, {width: width, height: height + this.toolbarheight});
    this.structureview = new JSDraw2.Editor(d, {viewonly: true});
  }

  /**
   * Resize Window (internal use)
   * @function resize
   */
  resize() {
    const d = dojo.window.getBox();
    const width = d.w;
    const height = d.h;
    const left = d.l;
    const top = d.t;
  }

  /**
   * Update Canvas from sequence/notation view (internal use)
   * @function updateCanvas
   */
  updateCanvas(key, append) {
    let format = null;

    const plugin = this.canvas.helm;
    let s = null;
    if (key == "sequence") {
      if (this.sequencebuttons != null)
        format = this.getValueByKey(this.sequencebuttons, "format");

      s = scil.Utils.trim(scil.Utils.getInnerText(this.sequence));
      if (/^((RNA)|(PEPTIDE)|(CHEM)|(BLOB))[0-9]+/.test(s)) {
        format = "HELM";
      } else {
        // fasta
        s = s.replace(/[\n][>|;].*[\r]?[\n]/ig, '').replace(/^[>|;].*[\r]?[\n]/i, '');
        // other space
        s = s.replace(/[ \t\r\n]+/g, '');
      }
    } else {
      s = scil.Utils.getInnerText(this.notation);
    }
    plugin.setSequence(s, format, plugin.getDefaultNodeType(org.helm.webeditor.HELM.SUGAR), plugin.getDefaultNodeType(org.helm.webeditor.HELM.LINKER), append);
  }

  /**
   * Tool function to get item by using its key (internal use)
   * @function getValueByKey
   */
  getValueByKey(list, key) {
    for (let i = 0; i < list.length; ++i) {
      if (list[i].key == key)
        return list[i].b.value;
    }
    return null;
  }

  /**
   * update helm properties (internal use)
   * @function updateProperties
   */
  updateProperties() {
    switch (this.tabs.tabs.currentTabKey()) {
    case "sequence":
      if (this.sequence != null)
        this.sequence.innerHTML = this.canvas.getSequence(true);
      break;
    case "notation":
      if (this.notation != null) {
        const helm = scil.Utils.getInnerText(this.notation);
        const s = this.canvas.getHelm(true);
        if (helm != s) {
          this.notation.innerHTML = s;
          this.setNotationBackgroundColor("white");
        }
      }
      break;
    case "properties":
      this.calculateProperties();
      break;
    case "structureview":
      this.updateStructureView();
      break;
    }
  }

  setNotationBackgroundColor(c) {
    if (this.notation != null)
      this.notation.parentElement.parentElement.style.background = c;
  }

  /**
   * Event handler when selection is changed (internal use)
   * @function onselectionchanged
   */
  onselectionchanged() {
    switch (this.tabs.tabs.currentTabKey()) {
    case "sequence":
      if (this.sequence != null) {
        this.sequence.innerHTML = this.canvas.getSequence(true);
      }
      break;
    case "notation":
      if (this.notation != null)
        this.notation.innerHTML = this.canvas.getHelm(true);
      break;
    case "structureview":
      this.updateStructureView();
      break;
    }
  }

  /**
   * Calaulte helm structure properties (internal use)
   * @function calculateProperties
   */
  calculateProperties() {
    if (this.properties == null)
      return;

    const data: any = {};
    this.properties.setData(data);
    if (this.options.calculatorurl != null) {
      const me = this;
      const helm = this.canvas.getHelm();
      if (helm != null) {
        scil.Utils.ajax(this.options.calculatorurl, function(ret) {
          me.properties.setData(ret);
        }, {helm: helm});
      }
    } else {
      data.mw = Math.round(this.canvas.getMolWeight() * 100) / 100;
      data.mf = this.canvas.getFormula(true);
      data.ec = Math.round(this.canvas.getExtinctionCoefficient(true) * 100) / 100;
      this.properties.setData(data);
    }
  }

  /**
   * Get selection as a molfile (internal use)
   * @function getSelectedAsMol
   */
  getSelectedAsMol(m): Mol<HelmType> {
    const ret = new JSDraw2.Mol();
    for (let i = 0; i < m.atoms.length; ++i) {
      if (m.atoms[i].selected)
        ret.atoms.push(m.atoms[i]);
    }

    const atoms = ret.atoms;
    for (let i = 0; i < m.bonds.length; ++i) {
      const b = m.bonds[i];
      if (b.selected && b.a1.selected && b.a2.selected)
        ret.bonds.push(b);
    }

    return ret;
  }

  /**
   * Tool function to select bonds of all selected atoms (internal use)
   * @function selectBondsOfSelectedAtoms
   */
  selectBondsOfSelectedAtoms(m) {
    let n = 0;
    for (let i = 0; i < m.bonds.length; ++i) {
      const b = m.bonds[i];
      if (!b.selected && b.a1.selected && b.a2.selected) {
        b.selected = true;
        ++n;
      }
    }

    return n;
  }

  containsAll(list, sublist) {
    for (let i = 0; i < sublist.length; ++i) {
      if (scil.Utils.indexOf(list, sublist[i]) < 0)
        return false;
    }

    return true;
  }

  expandRepeat(br, repeat, m, selected) {
    let r1 = null;
    let r2 = null;
    let b1: Bond<HelmType> = null;
    let b2: Bond<HelmType> = null;

    const oldbonds = [];
    for (let i = 0; i < m.bonds.length; ++i) {
      const b = m.bonds[i];
      const i1 = scil.Utils.indexOf(br.atoms, b.a1);
      const i2 = scil.Utils.indexOf(br.atoms, b.a2);
      if (i1 >= 0 && i2 >= 0) {
        oldbonds.push(b);
      } else if (i1 >= 0 && i2 < 0) {
        if (b.r1 == 1) {
          r1 = b.a1;
          b1 = b;
        } else if (b.r1 == 2) {
          r2 = b.a1;
          b2 = b;
        }
      } else if (i2 >= 0 && i1 < 0) {
        if (b.r2 == 1) {
          r1 = b.a2;
          b1 = b;
        } else if (b.r2 == 2) {
          r2 = b.a2;
          b2 = b;
        }
      }
    }

    for (let count = 0; count < repeat - 1; ++count) {
      const newatoms = [];
      let na1 = null;
      let na2 = null;
      for (let i = 0; i < br.atoms.length; ++i) {
        const a0 = br.atoms[i];
        const na = a0.clone();
        selected.atoms.push(na);
        newatoms.push(na);

        if (a0 == r1)
          na1 = na;
        else if (a0 == r2)
          na2 = na;
      }

      for (let i = 0; i < oldbonds.length; ++i) {
        const b0 = oldbonds[i];
        const nb = b0.clone();
        selected.bonds.push(nb);
        m.bonds.push(nb);
        nb.a1 = newatoms[scil.Utils.indexOf(br.atoms, b0.a1)];
        nb.a2 = newatoms[scil.Utils.indexOf(br.atoms, b0.a2)];
      }

      let nb: Bond<HelmType> = null;
      if (b1 == null) {
        nb = new JSDraw2.Bond(null, null, JSDraw2.BONDTYPES.SINGLE);
        nb.r1 = 2;
        nb.r2 = 1;
      } else {
        nb = b1.clone();
      }
      selected.bonds.push(nb);
      m.bonds.push(nb);
      if (b1 == null || b1.a1 == r1) {
        nb.a1 = na1;
        nb.a2 = r2;
      } else {
        nb.a2 = na1;
        nb.a1 = r2;
      }

      if (b2 != null) {
        b2.replaceAtom(r2, na2);
        r2 = na2;
      }
    }
  }

  /**
   * Update structure view from Canvas (internal use)
   * @function updateStructureView
   */
  updateStructureView() {
    if (this.structureview == null)
      return;
    this.structureview.clear(true);

    const m2 = this.canvas.m.clone();
    for (let i = 0; i < m2.atoms.length; ++i)
      m2.atoms[i].__mol = null;

    if (this.selectBondsOfSelectedAtoms(m2) > 0)
      this.canvas.refresh();
    const selected = this.getSelectedAsMol(m2);
    if (selected == null || selected.atoms.length == 0)
      return;

    const atoms = selected.atoms;
    const bonds = selected.bonds;

    for (let i = 0; i < m2.graphics.length; ++i) {
      const br = JSDraw2.Bracket.cast(m2.graphics[i]);
      if (br == null)
        continue;

      const repeat = br == null ? null : br.getSubscript(m2);
      const n = parseInt(repeat);
      if (n > 1 && br.atoms != null && br.atoms.length > 0 && this.containsAll(atoms, br.atoms)) {
        this.expandRepeat(br, n, m2, selected);
      }
    }

    let bondlength: number = null;
    const mols = [];
    for (let i = 0; i < atoms.length; ++i) {
      const a = atoms[i];
      const mon = org.helm.webeditor.Monomers.getMonomer(a);
      const m = org.helm.webeditor.Interface.createMol(org.helm.webeditor.Monomers.getMolfile(mon));
      a.__mol = m;

      // cap R groups
      const connected = m2.getAllBonds(a);
      const used = {};
      for (let k = 0; k < connected.length; ++k) {
        const bond = connected[k];
        if (bond.a1 == a)
          used["R" + bond.r1] = true;
        else if (bond.a2 == a)
          used["R" + bond.r2] = true;
      }

      for (const r in mon.at) {
        if (used[r])
          continue;

        this._replaceR(m, r, mon.at[r]);
      }

      if (m != null && !m.isEmpty()) {
        const d = m.medBondLength();
        if (!(bondlength > 0))
          bondlength = d;
        else
          m.scale(bondlength / d, new JSDraw2.Point(0, 0));
      }
      mols.push(m);
    }

    while (atoms.length > 0) {
      const a = atoms[0];
      atoms.splice(0, 1);
      this.connectNextMonomer(a, atoms, bonds);
    }

    const mol = mols[0];
    for (let i = 1; i < mols.length; ++i)
      mol.mergeMol(mols[i]);

    if (mol == null)
      return;

    if (this.options.cleanupurl != null) {
      if (this.options.onCleanUpStructure != null) {
        this.options.onCleanUpStructure(mol, this);
      } else {
        const me = this;
        scil.Utils.ajax(this.options.cleanupurl, function(ret) {
          me.structureview.setMolfile(ret == null ? null : ret.output);
        }, {input: mol.getMolfile(), inputformat: "mol", outputformat: "mol"});
      }
    } else {
      this.structureview.setMolfile(mol.getMolfile());
    }
  }

  _replaceR(m, r, e) {
    if (e == "OH")
      e = "O";
    if (e != "H" && e != "O" && e != "X")
      return false;

    for (let i = 0; i < m.atoms.length; ++i) {
      const a = m.atoms[i];
      if (a.elem == "R" && a.alias == r) {
        a.elem = e;
        a.alias = null;
        return true;
      }
    }

    return false;
  }

  connectNextMonomer(a, atoms, bonds) {
    const m1 = a.__mol;
    const oas = [];
    for (let i = bonds.length - 1; i >= 0; --i) {
      const b = bonds[i];

      let r1 = null;
      let r2 = null;
      let oa = null;
      if (b.a1 == a) {
        r1 = b.r1 == null ? null : "R" + b.r1;
        r2 = b.r2 == null ? null : "R" + b.r2;
        oa = b.a2;
      } else if (b.a2 == a) {
        r1 = b.r2 == null ? null : "R" + b.r2;
        r2 = b.r1 == null ? null : "R" + b.r1;
        oa = b.a1;
      }
      if (oa == null)
        continue;

      bonds.splice(i, 1);
      if (oa.__mol == null)
        continue;

      const m2 = oa.__mol;
      if (r1 != null && r2 != null)
        org.helm.webeditor.MolViewer.joinMol(m1, r1, m2, r2);
      oas.push(oa);
    }

    for (let i = 0; i < oas.length; ++i) {
      const oa = oas[i];
      const p = scil.Utils.indexOf(atoms, oa);
      if (p == -1 || p == null)
        continue;

      atoms.splice(p, 1);
      this.connectNextMonomer(oa, atoms, bonds);
    }
  }
}

org.helm.webeditor.App = App;
