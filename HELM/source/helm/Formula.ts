﻿/*******************************************************************************
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


import type {HelmAtom, HelmBracket, HelmMol, IWebEditorMonomer, OrgType} from '../src/types/org-helm';
import type {JSDraw2ModuleType, ScilModuleType} from '@datagrok-libraries/js-draw-lite/src/types';

declare const scil: ScilModuleType;
declare const JSDraw2: JSDraw2ModuleType;
declare const org: OrgType;

export type AtomStatsType = { [elem: string]: number }

/**
 * Formula class
 * @class scil.helm.Formula
 */
export class Formula {
  /**
   * Calculate the MF of a molecule (internal use)
   * @function getMF
   */
  getMF(m: HelmMol, html: boolean): string | null {
    const stats = this.getAtomStats(m);
    if (stats == null)
      return null;

    let s = "";
    if (stats["C"] != null)
      s += "C" + this.subscription(stats["C"], html);
    if (stats["H"] != null)
      s += "H" + this.subscription(stats["H"], html);
    if (stats["N"] != null)
      s += "N" + this.subscription(stats["N"], html);
    if (stats["O"] != null)
      s += "O" + this.subscription(stats["O"], html);

    for (const e in stats) {
      if (e != "R" && e != "C" && e != "H" && e != "O" && e != "N")
        s += e + this.subscription(stats[e], html);
    }
    return s;
  }

  /**
   * Create subscription (internal use)
   * @function
   */
  subscription(n: number, html: boolean): string {
    if (n == 1)
      return "";
    return html ? "<sub>" + n + "</sub>" : `${n}`;
  }

  /**
   * Calculate the MW of a molecule (internal use)
   * @function getMW
   */
  getMW(m: HelmMol): number | null {
    const stats = this.getAtomStats(m);
    if (stats == null)
      return null;

    let sum = 0;
    for (const e in stats) {
      if (e != "R")
        sum += stats[e] * scil.helm.Interface.getElementMass(e);
    }
    return Math.round(sum * 10000) / 10000.0;
  }

  /**
   * Calculate atom counts (internal use)
   * @function getAtomStats
   */
  getAtomStats(m: HelmMol): AtomStatsType {
    const stats: AtomStatsType = {};
    this.getAtomStats2(m, stats);
    return stats;
  }

  getAtomStats2(m: HelmMol, stats: any): null {
    const brackets: any[] = [];
    for (let i = 0; i < m.graphics.length; ++i) {
      const br = JSDraw2.Bracket.cast(m.graphics[i]);
      if (br != null && br.atoms != null && br.atoms.length > 0) {
        const n = br.getSubscript(m);
        if (!(n! > 0))
          return null;
        if (n! > 1)
          brackets.push({br: br, n: n});
      }
    }

    const atoms = [];
    const list = [];
    for (let i = 0; i < m.atoms.length; ++i) {
      const a = m.atoms[i];
      if (a.elem == "?")
        return null;

      if (scil.helm.isHelmNode(a)) {
        if (a.biotype() == scil.helm.HELM.BLOB && a.superatom != null) {
          //group
          this.getAtomStats2(a.superatom, stats);
        } else {
          list.push(a);
          const n = this.getRepeat(brackets, a);
          if (n > 0) {
            for (let k = 1; k < n; ++k)
              list.push(a);
          }
        }
      } else {
        atoms.push(a);
      }
    }

    // chemistry
    const ret = atoms.length == null ? null : scil.helm.Interface.getAtomStats(m, atoms);
    JSDraw2.FormulaParser.mergeStats(stats, ret);

    if (list.length == 0)
      return stats;

    for (let i = 0; i < list.length; ++i)
      this.countMonomer(stats, org.helm.webeditor.Monomers.getMonomer(list[i])!);

    for (let i = 0; i < m.bonds.length; ++i) {
      const b = m.bonds[i];
      if (scil.helm.isHelmNode(b.a1))
        this.deductR(stats, org.helm.webeditor.Monomers.getMonomer(b.a1)!, b.r1 as number);
      if (scil.helm.isHelmNode(b.a2))
        this.deductR(stats, org.helm.webeditor.Monomers.getMonomer(b.a2)!, b.r2 as number);
    }

    return stats;
  }

  getRepeat(brackets: HelmBracket[], a: HelmAtom): number {
    for (let i = 0; i < brackets.length; ++i) {
      const b: any = brackets[i];
      if (scil.Utils.indexOf(b.br.atoms, a) >= 0)
        return b.n;
    }

    return 1;
  }

  /**
   * Count monomers (internal use)
   * @function countMonomer
   */
  countMonomer(ret: AtomStatsType, m: IWebEditorMonomer): void {
    if (m == null)
      return;

    if (m.stats == null) {
      m.stats = scil.helm.Interface.molStats(org.helm.webeditor.monomers.getMolfile(m)!);
      for (const r in m.at) {
        const s = m.at[r];
        if (s == "H" || s == "OH") {
          if (m.stats["H"] == null)
            m.stats["H"] = 1;
          else
            ++m.stats["H"];
        }

        if (s == "OH") {
          if (m.stats["O"] == null)
            m.stats["O"] = 1;
          else
            ++m.stats["O"];
        }
      }
    }

    for (let e in m.stats) {
      if (ret[e] == null)
        ret[e] = m.stats[e];
      else
        ret[e] += m.stats[e];
    }
  }

  /**
   * Deduct R group (internal use)
   * @function deductR
   */
  deductR(ret: AtomStatsType, m: IWebEditorMonomer, r: number): void {
    if (m == null || m.at == null)
      return;

    const s = m.at["R" + r];
    if (s == "H") {
      --ret["H"];
    } else if (s == "OH") {
      --ret["H"];
      --ret["O"];
    }
  }
}

scil.helm.Formula = new Formula();
