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

import type {DojoType} from '@datagrok/js-draw-lite/src/types/dojo';

import type {JSDraw2ModuleType, ScilModuleType} from '@datagrok/js-draw-lite/src/types';
import type {HweHelmType, IExplorerMonomer, IMonomerExplorerOptions, OrgType, TabDescType} from '../src/types/org-helm';
import type {HelmType, HelmTypes, IOrgMonomer, IOrgWebEditorMonomer} from '@datagrok/js-draw-lite/src/types/org';
import type {StyleType} from '@datagrok/js-draw-lite/src/types/common';
import type {IDnD} from '@datagrok/js-draw-lite/src/types/scil';
import type {Editor} from '@datagrok/js-draw-lite/src/JSDraw.Editor';

declare const dojo: DojoType;
declare const scilligence: ScilModuleType;
declare const scil: ScilModuleType;
declare const org: OrgType;
declare const JSDraw2: JSDraw2ModuleType<any>;
declare let JSDrawServices: any;

/**
 * MonomerExplorer class
 * @class org.helm.webeditor.MonomerExplorer
 */
export class MonomerExplorerInt {
  private readonly T: string;
  public plugin: any; // TODO: ?
  private readonly options: any;
  private height: number | null;
  private kStyle: any;
  private selected: { [type: string]: string };
  private readonly div: HTMLDivElement;
  private readonly findtype!: HTMLSelectElement;
  private readonly findinput!: HTMLInputElement;
  private readonly findreplace!: HTMLInputElement;
  private readonly filterInput!: HTMLInputElement;

  private readonly tabs: any;
  private readonly dnd: any;
  private rules!: HTMLTableSectionElement;
  private rules_category!: HTMLSelectElement;
  private curtab: any;

  private monomerstabs: any;
  private rnatabs: any;

  private divRule?: HTMLDivElement;
  private divFavorite?: HTMLDivElement;
  private divChem?: HTMLDivElement;
  private divAA?: HTMLDivElement;

  private lastdiv?: HTMLDivElement;
  private pinmenu: any;

  /**
   * @constructor MonomerExplorer
   * @param {DOM} parent - The parent element
   * @param {Plugin} plugin - The Plugin object
   * @param {dict} options - options on how to render the Monomer Explorer
   */
  constructor(parent: HTMLDivElement, plugin: Editor<HelmType>, options: Partial<IMonomerExplorerOptions> | null) {
    this.T = 'MONOMER_EXPLORER';
    this.plugin = plugin;
    this.options = options == null ? {} : options;
    this.height = null;
    const w = this.options.monomerwidth > 0 ? this.options.monomerwidth : 50;
    this.kStyle = {borderRadius: '5px', border: 'solid 1px gray', backgroundRepeat: 'no-repeat', display: 'table', width: w, height: w, float: 'left', margin: 2};

    if (this.options.mexuseshape)
      this.kStyle.border = null;

    //this.lastselect = {};
    this.selected = {};
    this.selected[org.helm.webeditor.HELM.BASE] = org.helm.webeditor.Monomers.getDefaultMonomer(org.helm.webeditor.HELM.BASE);
    this.selected[org.helm.webeditor.HELM.LINKER] = org.helm.webeditor.Monomers.getDefaultMonomer(org.helm.webeditor.HELM.LINKER);
    this.selected[org.helm.webeditor.HELM.SUGAR] = org.helm.webeditor.Monomers.getDefaultMonomer(org.helm.webeditor.HELM.SUGAR);
    this.selected[org.helm.webeditor.HELM.AA] = org.helm.webeditor.Monomers.getDefaultMonomer(org.helm.webeditor.HELM.AA);
    this.selected[org.helm.webeditor.HELM.CHEM] = org.helm.webeditor.Monomers.getDefaultMonomer(org.helm.webeditor.HELM.CHEM);

    const me = this;
    this.div = scil.Utils.createElement(parent, 'div', null, {fontSize: this.options.mexfontsize == null ? '90%' : this.options.mexfontsize});
    if (this.options.mexfind) {
      const d = scil.Utils.createElement(this.div, 'div', null, {background: '#eee', borderBottom: 'solid 1px gray', padding: '4px 0 4px 0'});
      const tbody = scil.Utils.createTable(d, 0, 0);
      let tr = scil.Utils.createElement(tbody, 'tr');
      scil.Utils.createElement(tr, 'td', 'Quick Replace:', null, {colSpan: 3});
      this.findtype = scil.Utils.createElement(scil.Utils.createElement(tr, 'td'), 'select', null, {width: `100px`});
      scil.Utils.listOptions(this.findtype, org.helm.webeditor.monomerTypeList(), null, true, false);

      tr = scil.Utils.createElement(tbody, 'tr');
      this.findinput = scil.Utils.createElement(scil.Utils.createElement(tr, 'td'), 'input', null, {width: `60px`});
      scil.Utils.createElement(scil.Utils.createElement(tr, 'td'), 'span', '&rarr;');
      this.findreplace = scil.Utils.createElement(scil.Utils.createElement(tr, 'td'), 'input', null, {width: `60px`});
      scil.Utils.createButton(scil.Utils.createElement(tr, 'td', null, {textAlign: 'right'}), {
        label: 'Update', onclick() {
          me.findReplace();
        },
      });
    }
    if (this.options.mexfilter != false) {
      const d = scil.Utils.createElement(this.div, 'div', null, {background: '#eee', borderBottom: 'solid 1px gray', padding: '4px 0 4px 0'});
      const tbody = scil.Utils.createTable(d, 0, 0);
      const tr = scil.Utils.createElement(tbody, 'tr');
      scil.Utils.createElement(tr, 'td', JSDraw2.Language.res('Filter') + ':', {paddingLeft: '5px'});
      this.filterInput = scil.Utils.createElement(scil.Utils.createElement(tr, 'td'), 'input');
      scil.connect(this.filterInput, 'onkeyup', function(e: any) {
        me.filter(e);
      });
    }

    const tabs: TabDescType[] = [];
    if (this.options.mexmonomerstab)
      tabs.push({caption: 'Monomers', tabkey: 'monomers'});
    else
      this.addMonomerTabs(tabs);
    tabs.push({caption: 'Rules', tabkey: 'rule'});

    const width = this.options.width != null ? this.options.width : 300;
    this.height = this.options.height != null ? this.options.height : 400;
    this.tabs = new scil.Tabs(scil.Utils.createElement(this.div, 'div', null, {padding: '5px'}), {
      onShowTab(td: HTMLTableCellElement) {
        me.onShowTab(td);
      },
      tabpadding: this.options.mexmonomerstab ? '10px' : '5px 2px 1px 2px',
      tabs: tabs,
      marginBottom: 0,
    });

    this.dnd = this.createDnD(this.div);
    scil.connect(document.body, 'onmousemove', function(e: MouseEvent) {
      me.showMol(e);
    });

    org.helm.webeditor.MonomerExplorer.loadNucleotides();
  };

  /**
   * Add Monomer Tabs (internal use)
   * @function addMonomerTabs
   */
  addMonomerTabs(tabs: TabDescType[]) {
    if (this.options.mexfavoritetab != false)
      tabs.push({caption: 'Favorite', tabkey: 'favorite'});

    tabs.push({caption: 'Chem', tabkey: 'chem'});
    tabs.push({caption: 'Peptide', tabkey: 'aa'});
    tabs.push({caption: 'RNA', tabkey: 'rna'});
  }

  /**
   * Find and replace monomer (internal use)
   * @function findReplace
   */
  findReplace() {
    this.plugin.replaceAll(this.findinput.value, this.findreplace.value, this.findtype.value);
  }

  /**
   * Filter monomers (internal use)
   * @function filter
   */
  filter(e: KeyboardEvent): void {
    const key = this.tabs.currentTabKey();
    if (key == 'rule') {
      org.helm.webeditor.RuleSet.filterRules(this.rules, this.filterInput.value, this.rules_category.value);
    } else {
      this.filterGroup(this.filterInput.value);
    }
  }

  /**
   * Filter a group (internal use)
   * @function filterGroup
   */
  filterGroup(s: string | null) {
    if (s == '')
      s = null;

    const groups = this.curtab.clientarea.className == 'filtergroup' ? [this.curtab.clientarea] : this.curtab.clientarea.getElementsByClassName('filtergroup');
    for (let k = 0; k < groups.length; ++k) {
      let startingwith: IExplorerMonomer[] = [];
      const containing: IExplorerMonomer[] = [];
      const hidden = [];

      const parent = groups[k];
      for (let i = 0; i < parent.childNodes.length; ++i) {
        const d = parent.childNodes[i];
        const name = scil.Utils.getInnerText(d);
        const html = scil.Utils.isNullOrEmpty(name) ? d.innerHTML : null;
        let f = 1;
        if (s != null) {
          f = 0;
          if (scil.Utils.startswith(name.toLowerCase(), s)) {
            f = 1;
          } else if (name.toLowerCase().indexOf(s) >= 0) {
            f = 2;
          } else if (s.length >= 3 || org.helm.webeditor.MonomerExplorer.filtername) {
            const type = d.getAttribute('helm');
            const set = type == org.helm.webeditor.MonomerExplorer.kNucleotide ? org.helm.webeditor.MonomerExplorer.nucleotides : org.helm.webeditor.Monomers.getMonomerSet(type);
            const m = set[scil.helm.symbolCase(name)];
            const monomer = m as IOrgWebEditorMonomer;
            if (monomer != null && monomer.n != null) {
              if (scil.Utils.startswith(monomer.n.toLowerCase(), s))
                f = 1;
              else if (monomer.n.toLowerCase().indexOf(s) >= 0)
                f = 2;
            }
          }
        }

        if (f == 1)
          startingwith.push({id: name, div: d, html: html});
        else if (f == 2)
          containing.push({id: name, div: d, html: html});
        else
          hidden.push(d);
      }

      startingwith.sort(org.helm.webeditor.MonomerExplorer.compareMonomers);
      if (containing.length > 0) {
        containing.sort(org.helm.webeditor.MonomerExplorer.compareMonomers);
        startingwith = startingwith.concat(containing);
      }

      let last = null;
      for (let i = 0; i < startingwith.length; ++i) {
        const d = startingwith[i];
        parent.insertBefore(d.div, parent.childNodes[i]);
        last = d.div;
        if (s != null)
          (d.div.firstChild!.firstChild as HTMLElement).innerHTML = this.highlightString(d.id, s);
        else
          (d.div.firstChild!.firstChild as HTMLElement).innerHTML = d.html != null ? d.html : d.id;
        d.div.style.display = 'table';
      }

      for (let i = 0; i < hidden.length; ++i)
        hidden[i].style.display = 'none';
    }
  }

  /**
   * Highlight search string (internal use)
   * @function highlightString
   */
  highlightString(s: string, q: string) {
    const p = s.toLowerCase().indexOf(q);
    if (p < 0)
      return s;

    return s.substr(0, p) + '<span style=\'background:yellow\'>' + s.substr(p, q.length) + '</span>' + s.substr(p + q.length);
  }

  /**
   * Reload a tab (internal use)
   * @function reloadTab
   */
  reloadTab(type: HweHelmType): void {
    let key = null;
    switch (type) {
    case 'nucleotide':
      key = type;
      break;
    case org.helm.webeditor.HELM.AA:
      key = 'aa';
      break;
    case org.helm.webeditor.HELM.CHEM:
      key = 'chem';
      break;
    case org.helm.webeditor.HELM.BASE:
      key = 'base';
      break;
    case org.helm.webeditor.HELM.LINKER:
      key = 'linker';
      break;
    case org.helm.webeditor.HELM.SUGAR:
      key = 'sugar';
      break;
    default:
      return;
    }

    let td = this.tabs.findTab(key);
    if (td == null && this.monomerstabs != null)
      td = this.monomerstabs.findTab(key);
    if (td == null)
      td = this.rnatabs.findTab(key);

    if (td != null)
      this.onShowTab(td, true);
  }

  /**
   * Reload all tabs (internal use)
   * @function reloadTabs
   */
  reloadTabs() {
    var list = this.tabs.tr.childNodes;
    for (var i = 0; i < list.length; ++i) {
      var td = list[i];
      scil.Utils.removeAll(td.clientarea);
      td._childrencreated = false;
    }

    this.onShowTab(this.tabs.currenttab);
  }

  /**
   * resize Monomer Explorer (internal use)
   * @function resize
   */
  resize(height: number) {
    this.height = height;

    if (this.divRule != null)
      this.divRule.style.height = this.getHeight('rule') + 'px';
    if (this.divFavorite != null)
      this.divFavorite.style.height = this.getHeight('favorite') + 'px';
    if (this.divChem != null)
      this.divChem.style.height = this.getHeight('chem') + 'px';
    if (this.divAA != null)
      this.divAA.style.height = this.getHeight('aa') + 'px';

    if (this.rnatabs != null)
      this.rnatabs.resizeClientarea(0, this.getHeight('RNA'));
  }

  /**
   * Get the height of the Monomer Explorer (internal use)
   * @function getHeight
   */
  getHeight(key: string): number {
    const d1 = this.options.mexmonomerstab ? 0 : 14;
    const d2 = this.options.mexmonomerstab ? 0 : 47;
    const d3 = this.options.mexmonomerstab ? 0 : 46;
    switch (key) {
    case 'rule':
      return this.height! - 19 + d1;
    case 'favorite':
      return this.height! - 33 + d2;
    case 'chem':
      return this.height! - 33 + d2;
    case 'aa':
      return this.height! - 33 + d2;
    case 'RNA':
      return this.height! - 59 + d3;
    }

    return this.height!;
  }

  /**
   * Event handler when showing a tab (internal use)
   * @function onShowTab
   */
  onShowTab(td: HTMLTableCellElement & any, forcerecreate?: boolean): void {
    if (td == null)
      return;

    this.filterInput!.value = '';
    this.curtab = td;
    this.filterGroup('');

    const key = td.getAttribute('key');
    if (forcerecreate || key == 'favorite' && org.helm.webeditor.MonomerExplorer.favorites.changed) {
      td._childrencreated = false;
      if (key == 'favorite')
        org.helm.webeditor.MonomerExplorer.favorites.changed = false;
    }

    if (this.plugin != null && this.plugin.jsd != null)
      this.plugin.jsd.doCmd('helm_' + key);
    if (td._childrencreated)
      return;
    td._childrencreated = true;

    const me = this;
    const div = td.clientarea;
    scil.Utils.unselectable(div);
    scil.Utils.removeAll(div);

    if (key == 'favorite') {
      this.divFavorite = scil.Utils.createElement(div, 'div', null, {width: '100%', height: `{this.getHeight(key)}px`, overflowY: 'scroll'});
      this.recreateFavorites(this.divFavorite);
    } else if (key == 'rna') {
      const d = scil.Utils.createElement(div, 'div');
      this.createMonomerGroup3(d, 'RNA', 0, false);
    } else if (key == 'nucleotide') {
      const dict = org.helm.webeditor.MonomerExplorer.loadNucleotides();
      const list = scil.Utils.getDictKeys(dict);
      this.createMonomerGroup4(div, key, list);
    } else if (key == 'aa') {
      this.divAA = scil.Utils.createElement(div, 'div', null, {width: '100%', height: `${this.getHeight(key)}px`, overflowY: 'scroll'});
      dojo.connect(this.divAA, 'onmousedown', function(e: MouseEvent) {
        me.select(e);
      });
      dojo.connect(this.divAA, 'ondblclick', function(e: MouseEvent) {
        me.dblclick(e);
      });
      this.createMonomerGroup4(this.divAA, org.helm.webeditor.HELM.AA, null, false, this.options.mexgroupanalogs != false);
    } else if (key == 'chem') {
      this.divChem = scil.Utils.createElement(div, 'div', null, {width: '100%', height: `${this.getHeight(key)}px`, overflowY: 'scroll'});
      this.createMonomerGroup(this.divChem, org.helm.webeditor.HELM.CHEM);
    } else if (key == 'base') {
      this.createMonomerGroup4(div, org.helm.webeditor.HELM.BASE, null, null, this.options.mexgroupanalogs != false);
    } else if (key == 'sugar') {
      this.createMonomerGroup4(div, org.helm.webeditor.HELM.SUGAR, null);
    } else if (key == 'linker') {
      this.createMonomerGroup4(div, org.helm.webeditor.HELM.LINKER, null, true);
    } else if (key == 'rule') {
      const toolbar = scil.Utils.createElement(div, 'div', null, {background: '#ccc'});
      scil.Utils.createElement(toolbar, 'span', 'Category:');
      this.rules_category = scil.Utils.createElement(toolbar, 'select');
      scil.Utils.listOptions(this.rules_category, org.helm.webeditor.RuleSetApp.categories);
      const me = this;
      scil.connect(this.rules_category, 'onchange', function() {
        org.helm.webeditor.RuleSet.filterRules(me.rules, me.filterInput.value, me.rules_category?.value);
      });

      this.divRule = scil.Utils.createElement(div, 'div', null, {width: '100%', height: `${this.getHeight(key)}px`, overflowY: 'scroll'});
      this.listRules();
    } else if (key == 'monomers') {
      const d = scil.Utils.createElement(div, 'div', null, {paddingTop: '5px'});

      if (this.options.canvastoolbar == false) {
        const b = scil.Utils.createElement(d, 'div', '<img src=\'' + scil.Utils.imgSrc('helm/arrow.png') + '\' style=\'vertical-align:middle\'>Mouse Pointer', {cursor: 'pointer', padding: '2px', border: 'solid 1px gray', margin: '5px'});
        scil.connect(b, 'onclick', function() {
          me.plugin.jsd.doCmd('lasso');
        });
      }

      const tabs: TabDescType[] = [];
      this.addMonomerTabs(tabs);
      this.monomerstabs = new scil.Tabs(d, {
        onShowTab(td: HTMLTableCellElement) {
          me.onShowTab(td);
        },
        tabpadding: '5px 2px 1px 2px',
        tabs: tabs,
        marginBottom: 0,
      });
    }
  }

  listRules() {
    const me = this;
    this.rules = org.helm.webeditor.RuleSet.listRules(this, function(script: any) {
      me.plugin.applyRule(script);
    }, function(scripts: any[]) {
      me.plugin.applyRules(scripts);
    });
  }

  /**
   * Get monomers by natural analog (internal use)
   * @function getMonomerDictGroupByAnalog
   */
  getMonomerDictGroupByAnalog(type: string): { [k: string]: any[] } {
    const set = org.helm.webeditor.Monomers.getMonomerSet(type);
    //for (var k in set)
    //    set[k].id = k;

    const ret: { [k: string]: any[] } = {};
    const aa = type == org.helm.webeditor.HELM.AA;
    if (aa) {
      ret['C-Term'] = [];
      ret['N-Term'] = [];
    }

    for (const k in set) {
      const m: IOrgWebEditorMonomer = set[k];
      let na: string = m.na!;
      if (aa) {
        if (m.at.R1 == null)
          na = 'N-Term';
        else if (m.at.R2 == null)
          na = 'C-Term';
      }
      if (scil.Utils.isNullOrEmpty(na))
        na = 'X';
      if (ret[na] == null)
        ret[na] = [];
      ret[na].push(m);
    }

    for (const k in ret)
      ret[k] = this.getMonomerNames(ret[k]);

    return ret;
  }

  /**
   * Get monomer list of a monomer type (internal use)
   * @function getMonomerList
   */
  getMonomerList(list: any, type: string, addnull?: boolean | null): string[] {
    if (list != null) {
      list.sort();
      return list;
    }

    var set = org.helm.webeditor.Monomers.getMonomerSet(type);
    //for (var k in set)
    //    set[k].id = k;
    list = scil.Utils.getDictValues(set);
    return this.getMonomerNames(list, addnull);
  }

  /**
   * Get monomer names (internal use)
   * @function getMonomerNames
   */
  getMonomerNames(list: IOrgWebEditorMonomer[], addnull?: boolean | null): string[] {
    const ret: string[] = [];
    //if (addnull)
    //    ret.push("null");

    list.sort(org.helm.webeditor.MonomerExplorer.compareMonomers);
    for (let i = 0; i < list.length; ++i)
      ret.push(list[i].id);

    return ret;
  }

  /**
   * Create a monomer group (internal use)
   * @function createMonomerGroup
   */
  createMonomerGroup(div: HTMLDivElement, type: HelmType, list?: any[], addnull?: boolean) {
    const me = this;
    list = this.getMonomerList(list, type, addnull);

    if (org.helm.webeditor.ambiguity) {
      if (type == org.helm.webeditor.HELM.CHEM)
        list.splice(0, 0, '*');
    }

    div.style.overflowY = 'scroll';
    this._listMonomers(div, list, type, this.options.mexfavoritefirst);
    dojo.connect(div, 'onmousedown', function(e: MouseEvent) {
      me.select(e);
    });
    dojo.connect(div, 'ondblclick', function(e: MouseEvent) {
      me.dblclick(e);
    });
  }

  /**
   * inner loop creating a monomer group (internal use)
   * @function createMonomerGroup3
   */
  createMonomerGroup3(div: HTMLDivElement, group: string, i: number, createbar: boolean) {
    const me = this as (MonomerExplorer & any);
    const parent = scil.Utils.createElement(div, 'div');
    if (createbar) {
      const bar = scil.Utils.createElement(parent, "div", group + ":", {
        background: "#ddd", borderTop: "solid 1px #aaa", marginTop: i == 0 ? undefined : "1px"
      });
      if (i > 0)
        new scil.Resizable(bar, {
          direction: "y", mouseovercolor: "#aaf", onresize: function(delta: number, resizable: any) {
            return me.onresize(delta, i);
          }
        });
    }

    const d = scil.Utils.createElement(parent, 'div');
    dojo.connect(d, 'onmousedown', function(e: MouseEvent) {
      me.select(e);
    });
    dojo.connect(d, 'ondblclick', function(e: MouseEvent) {
      me.dblclick(e);
    });

    if (group == 'RNA') {
      const base = org.helm.webeditor.Monomers.bases['A'] == null ? 'a' : 'A';
      const linker = org.helm.webeditor.Monomers.linkers['P'] == null ? 'p' : 'P';
      const sugar = org.helm.webeditor.Monomers.sugars['R'] == null ? 'r' : 'R';

      const tabs = [
        {
          caption: this.createRNATabCaption('nucleotide', 'R(A)P'), tabkey: 'nucleotide', onmenu: this.options.mexrnapinontab ? function(e: any) {
            me.onPinMenu(e);
          } : null,
        },
        {caption: this.createRNATabCaption('base', base), tabkey: 'base'},
        {caption: this.createRNATabCaption('sugar', sugar), tabkey: 'sugar'},
        {caption: this.createRNATabCaption('linker', linker), tabkey: 'linker'},
      ];
      this.rnatabs = new scil.Tabs(scil.Utils.createElement(d, 'div', null, {paddingTop: '5px'}), {
        onShowTab(td: HTMLTableCellElement) {
          me.onShowTab(td);
        }, //function (td) { me.onShowRNATab(td); },
        tabpadding: '2px',
        tabs: tabs,
        marginBottom: 0,
        clientareaheight: this.getHeight('RNA'),
      });
    }
    //else if (group == "Chem") {
    //    d.style.overflowY = "scroll";
    //    d.style.height = height + "px";
    //    var list = this.getMonomerList(null, org.helm.webeditor.HELM.CHEM);
    //    this._listMonomers(d, list, org.helm.webeditor.HELM.CHEM, true);
    //}
    //else if (group == "Peptide") {
    //    d.style.overflowY = "scroll";
    //    d.style.height = height + "px";
    //    this.createMonomerGroup4(d, org.helm.webeditor.HELM.AA, null, false, this.options.mexgroupanalogs != false);
    //    //var list = this.getMonomerList(null, org.helm.webeditor.HELM.AA);
    //    //this._listMonomers(d, list, org.helm.webeditor.HELM.AA, true);
    //}
  }

  /**
   * Create RNA Tab caption (internal use)
   * @function
   */
  createRNATabCaption(type: string, label: string): string {
    var half = ' style=\'font-size: 80%;padding-left:20px;background-repeat:no-repeat;background-position:left center;background-image:';
    return '<div title=\'Nucleotide (Combined)\' ' + half + scil.Utils.imgSrc('img/helm_' + type.toLowerCase() + '.gif', true) + '\'>' + label + '</div>';
  }

  /**
   * Event handler when pinning a Combo (internal use)
   * @function onPinMenu
   */
  onPinMenu(e: any) {
    if (this.pinmenu == null) {
      const me = this;
      const items = [{caption: 'Pin This Nucleotide'}];
      this.pinmenu = new scil.ContextMenu(items, function() {
        me.addNucleotide();
      });
    }
    this.pinmenu.show(e.clientX, e.clientY);
  }

  /**
   * Inner loop creating a monomer group (internal use)
   * @function createMonomerGroup4
   */
  createMonomerGroup4(div: HTMLDivElement, type: HweHelmType, list: string[] | null, addnull?: boolean | null, groupbyanalog?: boolean | null): void {
    if (groupbyanalog) {
      const dict: { [k: string]: any[] } = this.getMonomerDictGroupByAnalog(type);

      if (org.helm.webeditor.ambiguity) {
        if (type == org.helm.webeditor.HELM.AA)
          dict['?'] = ['*', '_', 'X'];
        else if (type == org.helm.webeditor.HELM.BASE)
          dict['?'] = ['_', 'N', '*'];
      }

      let list: string[] = [];
      if (this.options.mexfavoritefirst) {
        for (const k in dict) {
          const list2 = dict[k];
          for (let i = 0; i < list2.length; ++i) {
            const a = list2[i];
            if (org.helm.webeditor.MonomerExplorer.favorites.contains(a, type))
              list.push(a);
          }
        }
        this._listMonomer2(div, scil.Utils.imgTag('star.png'), list, type, 20);
      }

      list = scil.Utils.getDictKeys(dict);
      list.sort();
      const list2: string[] = [];
      for (let i = 0; i < list.length; ++i) {
        const k = list[i];
        if (k == 'C-Term' || k == 'N-Term') {
          list2.push(k);
          continue;
        }
        this._listMonomer2(div, k, dict[k], type, 20);
      }

      for (let i = 0; i < list2.length; ++i) {
        const k = list2[i];
        this._listMonomer2(div, k, dict[k], type, 60);
      }
    } else {
      if (type == 'nucleotide' && !this.options.mexrnapinontab) {
        const me = this;
        const d = this.createMonomerDiv(div, scil.Utils.imgTag('pin.png'), 'nucleotide', null, false);
        d.setAttribute('title', 'Pin This Nucleotide');
        scil.connect(d, 'onclick', function() {
          me.addNucleotide();
        });
      }
      list = this.getMonomerList(list, type, addnull);
      if (org.helm.webeditor.ambiguity) {
        if (type == org.helm.webeditor.HELM.SUGAR)
          list.splice(0, 0, '*');
        else if (type == org.helm.webeditor.HELM.LINKER)
          list.splice(0, 0, '*');
        else if (type == 'nucleotide')
          list.splice(0, 0, '*');
      }

      this._listMonomers(div, list, type, this.options.mexfavoritefirst);
    }
  }

  /**
   * Add a nucleotide (internal use)
   * @function addNucleotide
   */
  addNucleotide(tab?: any) {
    const notation = this.getCombo();
    const dict = org.helm.webeditor.MonomerExplorer.nucleotides;
    for (const k in dict) {
      if (notation == dict[k]) {
        scil.Utils.alert('There is a defined nucleotide called: ' + k);
        return;
      }
    }

    var me = this;
    scil.Utils.prompt2({
      caption: "Pin Nucleotide: " + notation,
      message: "Please give a short name for the nucleotide, " + notation,
      callback: function(s: string) { if (org.helm.webeditor.MonomerExplorer.addCustomNucleotide(s, notation)) me.reloadTab("nucleotide"); }
    });
  }

  /**
   * Inner loop listing all monomer of a monomer type (internal use)
   * @function
   */
  _listMonomer2(div: HTMLDivElement, k: string, list: any[], type: string, width: number) {
    if (list.length == 0)
      return;

    const tbody = scil.Utils.createTable(div, 0, 0);
    const tr = scil.Utils.createElement(tbody, 'tr');
    const left = scil.Utils.createElement(tr, 'td', null, {verticalAlign: 'top'});
    const right = scil.Utils.createElement(tr, 'td', null, {verticalAlign: 'top'});
    scil.Utils.createElement(left, 'div', k, {width: `${width}px`, background: '#eee', border: 'solid 1px #aaa', textAlign: 'center'});
    this._listMonomers(right, list, type);
  }

  /**
   * Create favorite monomer group (internal use)
   * @function createMonomerGroupFav
   */
  createMonomerGroupFav(div: HTMLDivElement, caption: string, type: string) {
    const list = org.helm.webeditor.MonomerExplorer.favorites.getList(type);
    if (list == null || list.length == 0)
      return;

    list.sort();
    scil.Utils.createElement(div, 'div', caption + ':', {background: '#ddd', border: 'solid 1px #ddd'});
    const d = scil.Utils.createElement(div, 'div', null, {display: 'table', paddingBottom: '10px'});
    this._listMonomers(d, list, type, false);

    const me = this;
    dojo.connect(d, 'onmousedown', function(e: MouseEvent) {
      me.select(e);
    });
    dojo.connect(d, 'ondblclick', function(e: MouseEvent) {
      me.dblclick(e);
    });
  }

  /**
   * List a monomer group (internal use)
   * @function _listMonomers
   */
  _listMonomers(div: HTMLElement, list: any[], type: string, mexfavoritefirst?: boolean) {
    div.className = 'filtergroup';

    if (mexfavoritefirst) {
      const list2 = [];
      for (let i = 0; i < list.length; ++i) {
        if (org.helm.webeditor.MonomerExplorer.favorites.contains(list[i], type))
          this.createMonomerDiv(div, list[i], type);
        else
          list2.push(list[i]);
      }

      for (let i = 0; i < list2.length; ++i)
        this.createMonomerDiv(div, list2[i], type);
    } else {
      for (let i = 0; i < list.length; ++i)
        this.createMonomerDiv(div, list[i], type);
    }
  }

  /**
   * Recreate favorite monomers (internal use)
   * @function
   */
  recreateFavorites(d: HTMLDivElement) {
    this.createMonomerGroupFav(d, 'Nucleotide', org.helm.webeditor.MonomerExplorer.kNucleotide);
    this.createMonomerGroupFav(d, 'Base', org.helm.webeditor.HELM.BASE);
    this.createMonomerGroupFav(d, 'Sugar', org.helm.webeditor.HELM.SUGAR);
    this.createMonomerGroupFav(d, 'Linker', org.helm.webeditor.HELM.LINKER);
    this.createMonomerGroupFav(d, 'Chemistry', org.helm.webeditor.HELM.CHEM);
    this.createMonomerGroupFav(d, 'Peptide', org.helm.webeditor.HELM.AA);
  }

  /**
   * Create a monomer block (internal use)
   * @function createMonomerDiv
   */
  createMonomerDiv(parent: HTMLElement, name: string | null, type: string, style?: any, star?: any) {
    const fav = org.helm.webeditor.MonomerExplorer.favorites.contains(name, type);

    if (style == null)
      style = scil.clone(this.kStyle);
    else
      style = scil.apply(scil.clone(this.kStyle), style);

    if (this.options.mexusecolor != false) {
      let color;
      const custom = org.helm.webeditor.MonomerExplorer.customnucleotides;
      if (type == 'nucleotide' && custom != null && custom[name!] != null)
        color = {backgroundcolor: '#afa'};
      else
        color = style.backgroundColor = org.helm.webeditor.Monomers.getColor2(type, name);
      style.backgroundColor = color == null ? null : color.backgroundcolor;
    }

    if (star != false)
      style.backgroundImage = scil.Utils.imgSrc('img/star' + (fav ? '' : '0') + '.png', true);

    const div = scil.Utils.createElement(parent, 'div', null, style, {helm: type, bkcolor: style.backgroundColor, star: (star ? 1 : null)});
    scil.Utils.unselectable(div);

    if (this.options.mexuseshape)
      this.setMonomerBackground(div, 0);

    const d = scil.Utils.createElement(div, 'div', null, {display: 'table-cell', textAlign: 'center', verticalAlign: 'middle'});
    scil.Utils.createElement(d, 'div', name, {overflow: 'hidden', width: this.kStyle.width});

    return div;
  }

  /**
   * Set monomer block background (internal use)
   * @function setMonomerBackground
   */
  setMonomerBackground(div: HTMLDivElement, f: number) {
    const type = div.getAttribute('helm')!;
    if (scil.Utils.isNullOrEmpty(type))
      return;

    let bk = type.toLowerCase();
    if (type != org.helm.webeditor.MonomerExplorer.kNucleotide)
      bk = bk.substr(bk.indexOf('_') + 1);
    div.style.backgroundImage = scil.Utils.imgSrc('img/mon-' + bk + f + '.png', true);
  }

  /**
   * Get the monomer block (internal use)
   * @function getMonomerDiv
   */
  getMonomerDiv(e: MouseEvent): HTMLDivElement | null {
    let div: HTMLDivElement = (e.target || e.srcElement) as HTMLDivElement;
    if (div == null || div.tagName == null)
      return null;

    let type: string | null = null;
    for (let i = 0; i < 3; ++i) {
      type = div.getAttribute('helm');
      if (!scil.Utils.isNullOrEmpty(type))
        break;
      div = (div.tagName == 'BODY' ? null : div.parentElement) as HTMLDivElement;
      if (div == null)
        break;
    }
    return scil.Utils.isNullOrEmpty(type) ? null : div;
  }

  /**
   * Enable DnD (internal use)
   * @function createDnD
   */
  createDnD(div: HTMLDivElement): IDnD {
    const me = this;
    return new scil.DnD(div, {
      onstartdrag(e: MouseEvent, dnd: IDnD) {
        return me.getMonomerDiv(e);
      },
      oncreatecopy(e: MouseEvent, dnd: IDnD) {
        if (dnd.floatingbox == null) {
          const maxZindex = scil.Utils.getMaxZindex();
          const style: Partial<StyleType> = {
            float: undefined, backgroundImage: undefined,
            filter: 'alpha(opacity=80)', opacity: `0.8`, color: org.helm.webeditor.MonomerExplorer.color,
            backgroundColor: org.helm.webeditor.MonomerExplorer.backgroundcolor,
            zIndex: `${(maxZindex > 0 ? maxZindex : 100) + 1}`, position: 'absolute',
          };
          if (me.options.useshape)
            style.backgroundColor = undefined;
          const type = dnd.src.getAttribute('helm') as HelmType;
          dnd.floatingbox = me.createMonomerDiv(document.body, null, type, style, false);
        }
        dnd.floatingbox.style.display = 'table';
        dnd.floatingbox.style.backgroundColor = org.helm.webeditor.MonomerExplorer.backgroundcolor;
        dnd.floatingbox.innerHTML = dnd.src.innerHTML;
        dnd.floatingbox.setAttribute('helm', dnd.src.getAttribute('helm')!);
        if (me.options.useshape)
          me.setMonomerBackground(dnd.floatingbox, 1);
        return dnd.floatingbox;
      },
      ondrop(e: MouseEvent, dnd: IDnD) {
        if (dnd.floatingbox == null)
          return;

        me.dnd.floatingbox.style.display = 'none';

        const src = (e.target || e.srcElement) as HTMLElement;
        if (!scil.Utils.hasAnsestor(src, me.plugin.jsd.div))
          return;

        const type = dnd.floatingbox.getAttribute('helm');
        me.plugin.dropMonomer(type, scil.Utils.getInnerText(dnd.floatingbox), e);
      },
      oncancel(dnd: IDnD) {
        if (dnd.floatingbox == null)
          return;

        me.dnd.floatingbox.style.display = 'none';
        const type = dnd.floatingbox.getAttribute('helm');
      },
    });
  }

  /**
   * Show structure popup (internal use)
   * @function showMol
   */
  showMol(e: MouseEvent) {
    let src = this.getMonomerDiv(e);
    if (src != null && !this.dnd.isDragging()) {
      const type = src.getAttribute('helm')!;
      const set = type == org.helm.webeditor.MonomerExplorer.kNucleotide ? org.helm.webeditor.MonomerExplorer.nucleotides : org.helm.webeditor.Monomers.getMonomerSet(type);
      const s = scil.Utils.getInnerText(src);
      let m = set[scil.helm.symbolCase(s)];
      if (m == null)
        m = set[s];
      org.helm.webeditor.MolViewer.show(e, type as HelmType, m, s);
    } else {
      src = (e.srcElement || e.target) as HTMLDivElement;
      if (!scil.Utils.isChildOf(src, this.plugin.jsd.div))
        org.helm.webeditor.MolViewer.hide();
    }
  }

  /**
   * Tool to split a list (internal use)
   * @function splitLists
   */
  splitLists(set: any): string[][] {
    const lists: string[][] = [[], [], [], []];
    for (const k in set) {
      const m = set[k];
      if (m.at.R1 == null)
        lists[2].push(k);
      else if (m.at.R2 == null)
        lists[3].push(k);
      else if (k.length == 1)
        lists[0].push(k);
      else
        lists[1].push(k);
    }

    return lists;
  }

  /**
   * Change favorites (internal use)
   * @function changeFavorite
   */
  changeFavorite(div: HTMLDivElement) {
    const f = div.getAttribute('star') != '1';

    if (f) {
      div.setAttribute('star', '1');
      div.style.backgroundImage = scil.Utils.imgSrc('img/star.png', true);
    } else {
      div.setAttribute('star', '');
      div.style.backgroundImage = scil.Utils.imgSrc('img/star0.png', true);
    }

    const type = div.getAttribute('helm');
    const s = scil.Utils.getInnerText(div);
    org.helm.webeditor.MonomerExplorer.favorites.add(s, f, type);

    //this.reloadTab(type);
  }

  /**
   * Select a monomer (internal use)
   * @function select
   */
  select(e: MouseEvent) {
    const div = this.getMonomerDiv(e)!;
    if (div != null) {
      const d = scil.Utils.getOffset(div, true);
      const scroll = scil.Utils.getParent(div.parentElement, 'div')!;
      const dx = e.clientX - d.x + scroll.scrollLeft;
      const dy = e.clientY - d.y + scroll.scrollTop;
      if (dx >= 0 && dx < 16 && dy >= 0 && dy < 16) {
        // favorite
        this.changeFavorite(div);
        e.preventDefault();
        return;
      }
    }

    const helm: HelmType = (div == null ? null : div.getAttribute('helm')) as HelmType;
    if (scil.Utils.isNullOrEmpty(helm))
      return;

    this.plugin.jsd.activate(true);

    let name = scil.Utils.getInnerText(div);
    if (helm == org.helm.webeditor.MonomerExplorer.kNucleotide) {
      if (name != '*') {
        const s = org.helm.webeditor.MonomerExplorer.nucleotides[name];
        const p1 = s.indexOf('(');
        const p2 = s.indexOf(')');
        const sugar = org.helm.webeditor.IO.trimBracket(s.substr(0, p1));
        const base = org.helm.webeditor.IO.trimBracket(s.substr(p1 + 1, p2 - p1 - 1));
        let linker = org.helm.webeditor.IO.trimBracket(s.substr(p2 + 1));

        if (scil.Utils.isNullOrEmpty(linker))
          linker = 'null';

        this.selected[org.helm.webeditor.HELM.BASE] = base;
        this.selected[org.helm.webeditor.HELM.LINKER] = linker;
        this.selected[org.helm.webeditor.HELM.SUGAR] = sugar;

        if (this.rnatabs != null) {
          const tabs = this.rnatabs;
          tabs.updateTabLabel('nucleotide', this.createRNATabCaption('nucleotide', s));
          tabs.updateTabLabel('sugar', this.createRNATabCaption('sugar', sugar));
          tabs.updateTabLabel('linker', this.createRNATabCaption('linker', linker));
          tabs.updateTabLabel('base', this.createRNATabCaption('base', base));
        }
      }
    } else {
      name = org.helm.webeditor.IO.trimBracket(name);
      if (this.rnatabs != null) {
        var tab = null;
        var tabs = this.rnatabs;
        switch (helm) {
        case org.helm.webeditor.HELM.SUGAR:
          tab = 'sugar';
          break;
        case org.helm.webeditor.HELM.LINKER:
          tab = 'linker';
          break;
        case org.helm.webeditor.HELM.BASE:
          tab = 'base';
          break;
        }

        if (tab != null)
          tabs.updateTabLabel(tab, this.createRNATabCaption(tab, name));
      }

      this.selected[helm] = name;
      if (tabs != null)
        tabs.updateTabLabel('nucleotide', this.createRNATabCaption('nucleotide', this.getCombo()));
    }

    if (this.lastdiv != null) {
      this.lastdiv.style.color = '';
      if (this.options.mexuseshape) {
        this.setMonomerBackground(this.lastdiv, 0);
      } else {
        var s = this.lastdiv.getAttribute('bkcolor');
        this.lastdiv.style.backgroundColor = s == null ? '' : s;
      }
    }
    if (this.options.mexuseshape)
      this.setMonomerBackground(div, 1);
    else
      div.style.backgroundColor = org.helm.webeditor.MonomerExplorer.backgroundcolor;
    div.style.color = org.helm.webeditor.MonomerExplorer.color;
    this.lastdiv = div;

    if (this.plugin != null && this.plugin.jsd != null) {
      switch (helm) {
      case org.helm.webeditor.HELM.AA:
        this.plugin.jsd.doCmd('helm_aa');
        break;
      case org.helm.webeditor.HELM.CHEM:
        this.plugin.jsd.doCmd('helm_chem');
        break;
      case org.helm.webeditor.HELM.BASE:
        this.plugin.jsd.doCmd(this.options.alwaysdrawnucleotide ? 'helm_nucleotide' : 'helm_base');
        break;
      case org.helm.webeditor.HELM.LINKER:
        this.plugin.jsd.doCmd(this.options.alwaysdrawnucleotide ? 'helm_nucleotide' : 'helm_linker');
        break;
      case org.helm.webeditor.HELM.SUGAR:
        this.plugin.jsd.doCmd(this.options.alwaysdrawnucleotide ? 'helm_nucleotide' : 'helm_sugar');
        break;
      case org.helm.webeditor.MonomerExplorer.kNucleotide:
        this.plugin.jsd.doCmd('helm_nucleotide');
        break;
      }
    }
  }

  /**
   * Get the RNA combo (internal use)
   * @function getCombo
   */
  getCombo(): string {
    const sugar = this.selected[org.helm.webeditor.HELM.SUGAR];
    const linker = this.selected[org.helm.webeditor.HELM.LINKER];
    const base = this.selected[org.helm.webeditor.HELM.BASE];
    let s = org.helm.webeditor.IO.getCode(sugar);
    if (!org.helm.webeditor.Monomers.hasR(org.helm.webeditor.HELM.SUGAR, sugar, 'R3'))
      s += '()';
    else
      s += '(' + org.helm.webeditor.IO.getCode(base) + ')';
    if (linker != 'null')
      s += org.helm.webeditor.IO.getCode(linker);
    return s;
  }

  /**
   * Event of double click (internal use)
   * @function dblclick
   */
  dblclick(e: MouseEvent) {
    const div = this.getMonomerDiv(e)!;
    const helm = div == null ? null : div.getAttribute('helm');
    if (org.helm.webeditor.isHelmNode(helm)) {
      if (this.plugin.dblclickMomonor(helm, scil.Utils.getInnerText(div)) == 0)
        scil.Utils.beep();
    }
  }
}

export class MonomerExplorer extends MonomerExplorerInt {
  static kUseShape: boolean = false;
  static kNucleotide: string = 'nucleotide';
  static backgroundcolor: string = 'blue';
  static color: 'white';
  static customnucleotides: { [symbol: string]: string } | null = null;
  static filtername: boolean = false;
  static favorites: any = new scil.Favorite('monomers', function(name: string, f: any, type: any) {
    MonomerExplorer.onAddFavorite(name, f, type);
  });

  static nucleotides: { [symbol: string]: string } = {
    A: 'R(A)P',
    C: 'R(C)P',
    G: 'R(G)P',
    T: 'R(T)P',
    U: 'R(U)P',
  };

  /**
   * Compare if two monomers are same (internal use)
   * @function compareMonomers
   */
  static compareMonomers(a: IOrgMonomer, b: IOrgMonomer): number {
    if (a.id == b.id)
      return 0;
    else if (a.id == null)
      return -1;
    else if (b.id == null)
      return 1;
    else if (a.id.length != b.id.length && (a.id.length == 1 || b.id.length == 1))
      return a.id.length > b.id.length ? 1 : -1;
    else
      return scil.helm.symbolCase(a.id) > scil.helm.symbolCase(b.id) ? 1 : -1;
  }

  /**
   * Event handler on adding favorite (internal use)
   * @function onAddFavorite
   */
  static onAddFavorite(name: string, f: any, type: any) {
    const me = MonomerExplorer;
    if (!f && type == 'nucleotide' && me.customnucleotides != null && me.customnucleotides[name] != null) {
      delete me.customnucleotides[name];
      me.saveNucleotides();
    }
  }

  /**
   * Create a custom RNA combo (internal use)
   * @function addCustomNucleotide
   */
  static addCustomNucleotide(name: string, notation: string): boolean {
    const cls = MonomerExplorer;
    name = scil.Utils.trim(name);
    if (scil.Utils.isNullOrEmpty(name)) {
      scil.Utils.alert('The short name cannot be blank');
      return false;
    }

    if (org.helm.webeditor.MonomerExplorer.nucleotides[name] != null) {
      scil.Utils.alert('The short name is used for: ' + org.helm.webeditor.MonomerExplorer.nucleotides[name]);
      return false;
    }

    if (cls.customnucleotides == null)
      cls.customnucleotides = {};

    org.helm.webeditor.MonomerExplorer.nucleotides[name] = notation;
    cls.customnucleotides[name] = notation;
    cls.saveNucleotides();
    cls.favorites.add(name, true, 'nucleotide');

    return true;
  }

  /**
   * Save custom RNA Combos(internal use)
   * @function saveNucleotides
   */
  static saveNucleotides() {
    const s = scil.Utils.json2str(this.customnucleotides);
    scil.Utils.createCookie('scil_helm_nucleotides', s);
  }

  private static mex: MonomerExplorer;
  private static dlg: any;
  private static _nucleotidesloaded: boolean = false;

  /**
   * Read all saved custom RNA Combo (internal use)
   * @function loadNucleotides
   */
  static loadNucleotides() {
    const cls = MonomerExplorer;
    if (cls._nucleotidesloaded)
      return this.nucleotides;

    if (cls.nucleotides == null)
      cls.nucleotides = {};

    cls._nucleotidesloaded = true;
    const s = scil.Utils.readCookie('scil_helm_nucleotides');
    cls.customnucleotides = scil.Utils.eval(s!);
    if (cls.customnucleotides != null && cls.customnucleotides.length == null) {
      const list: { [symbol: string]: any } = {};
      for (const k in cls.customnucleotides) {
        if (this.nucleotides[k] == null) {
          list[k] = cls.customnucleotides[k];
          this.nucleotides[k] = cls.customnucleotides[k];
        }
      }
      cls.customnucleotides = list;
    }
    return this.nucleotides;
  }

  /**
   * Show Monomer Explorer as a dialog (internal use)
   * @function showDlg
   */
  static showDlg(jsd: any) {
    const cls = org.helm.webeditor.MonomerExplorer;
    cls.createDlg(jsd);
    cls.dlg.show2({owner: jsd, modal: false});
    jsd.helm.monomerexplorer = cls.mex;
  }

  /**
   * Create Monomer Explorer dialog (internal use)
   * @function createDlg
   */
  static createDlg(jsd: any) {
    const cls = org.helm.webeditor.MonomerExplorer;
    if (cls.dlg != null)
      return;

    const div = scil.Utils.createElement(null, 'div', null, {width: '500px'});
    this.dlg = new scil.Dialog('Monomer Explorer', div);
    this.dlg.show2({owner: jsd, modal: false});

    this.mex = new org.helm.webeditor.MonomerExplorer(div, jsd.helm, {height: 350});
    this.dlg.moveCenter();
  }
}

org.helm.webeditor.MonomerExplorer = MonomerExplorer;
